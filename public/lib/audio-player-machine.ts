import type { Howl, Howler } from 'howler';
import type { History } from '../helpers/history';

// @NOTE
// - Currently howler does not provide an ESM export
// - As a result we import directly and use the instance it attaches to the window
// - In the future we can look at importing from esm.sh but there are currently pre-render issues with this approach
import 'howler';

import { signal } from "@preact/signals";
import { isAfter, parseJSON } from "date-fns";
import { getTrack } from "../helpers/tracks";
import { updateHistory } from '../helpers/history';
import { assign, createMachine, interpret } from "xstate";
import { updateCachedHistory } from '../helpers/history';
import { restorePlayer, updateCachedVolume } from '../helpers/restore';

// @NOTE
// - Make window type definitions play nice
declare global {
  interface Window {
    Howl: typeof Howl;
    Howler: typeof Howler
  }
}

export interface Playable {
  id: string;
  url: string;
  progress?: number;
  position?: number;
}

interface PlayerMachineContext {
  player: Howl;
  volume: number;
  playing: Playable;
  history: History[];
}

const initialState = "restoring";
const persistInterval = 5; // In seconds
const contextInterval = 1; // In seconds

const createInitialContext = (
  context?: PlayerMachineContext,
): PlayerMachineContext => {
  const { volume = 0.5, history = [] } = context || {};

  // @NOTE
  // - It's infinitely easier if the machine thinks that all fields in the context are required
  // - Casting this value to `PlayerMachineContext` helps to handle the XState type inference
  return {
    volume,
    history,
  } as PlayerMachineContext;
};

const calculateProgress = (context: PlayerMachineContext) => {
  const position = context.player.seek();
  const duration = context.player.duration();
  const value = (position / duration) * 100;
  const progress = Math.round(value * 100 + Number.EPSILON) / 100;

  return progress;
};

const calculatePosition = (context: PlayerMachineContext) => {
  const progress = context.playing.progress || 0;
  const duration = context.player.duration();
  const percentage = progress / 100;

  return duration * percentage;
};

const getSelectedProgress = (context: PlayerMachineContext) => {
  const playing = context.playing;
  const match = context.history.find(item => item.id === playing.id);

  if (match === undefined) {
    return playing;
  }

  return {
    ...playing,
    progress: match.progress
  }
}

const getMostRecentPlaying = async (context: PlayerMachineContext) => {
  const [recent] = context.history.sort((a, b) => {
    return isAfter(parseJSON(a.updated), parseJSON(b.updated)) ? 1 : -1;
  });

  if (recent === undefined) {
    throw new Error(`Unable to find recently played, aborting`);
  }

  const track = await getTrack(recent.id);

  return {
    id: recent.id,
    url: track.url,
    progress: recent.progress,
  }
};

const playerMachine = createMachine<PlayerMachineContext>({
  predictableActionArguments: true,
  context: createInitialContext(),
  initial: initialState,
  on: {
    VOLUME_SET: {
      actions: [
        assign({ volume: (_, event) => event.value }),
        (_, event) => updateCachedVolume(event.value),
      ],
    },
    SELECT_TRACK: {
      target: "loading",
      actions: [
        assign((context) => createInitialContext(context)),
        assign({ playing: (_, event) => event.value }),
        assign({ playing: (context) => getSelectedProgress(context) })
      ],
    },
  },
  states: {
    // @NOTE
    // - We can't read the duration of the audio file on page load
    // - As a result we do all sorts of things to give the illusion
    // - Of loading whichever track the user was listening to previously
    // - https://github.com/goldfire/howler.js/issues/1154
    restoring: {
      invoke: {
        src: restorePlayer,
        onDone: {
          target: "resuming",
          actions: [
            assign({ volume: (_, event) => event.data.volume }),
            assign({ history: (_, event) => event.data.history }),
            (_, event) => updateCachedVolume(event.data.volume),
            (_, event) => updateCachedHistory(event.data.history),
          ],
        },
        onError: {
          target: "failed",
          actions: () => console.warn(`Error in 'restoring' state`)
        },
      },
    },
    resuming: {
      invoke: {
        src: getMostRecentPlaying,
        onDone: {
          target: "resumed",
          actions: [
            assign({ playing: (_, event) => event.data })
          ]
        },
        onError: {
          target: "stopped",
          actions: () => console.warn(`Error in 'resuming' state`)
        }
      }
    },
    failed: {
      type: "final",
      // @TODO
      // - Tell the user to refresh the page
    },
    resumed: {
      on: {
        PLAY: {
          target: "loading"
        }
      }
    },
    stopped: {},
    loading: {
      entry: () => window.Howler.unload(),
      invoke: {
        src: (context) =>
          new Promise((res) => {
            const player = new window.Howl({
              src: [context.playing.url],
              html5: true,
              volume: context.volume,
            });

            // @TODO
            // Setup events for `end` and `error`
            player.on("load", () => {
              return res(player);
            });
          }),
        onDone: {
          target: "playing",
          actions: [
            assign({ player: (_, event) => event.data }),
            // @NOTE
            // - Have to do this here once context is set
            (context) => context.player.seek(calculatePosition(context))
          ]
        },
        onError: {
          target: "failed",
          actions: () => console.warn(`Error in 'loading' state`)
        },
      },
    },
    paused: {
      // @TODO
      // - Move relevant events here
      entry: [
        (context) => context.player.pause(),
      ],
      on: {
        PLAY: {
          target: "playing"
        }
      }
    },
    playing: {
      on: {
        PAUSE: {
          target: "paused",
        },
        UPDATE_CONTEXT: {
          actions: assign({
            playing: (context, event) => {
              return {
                ...context.playing,
                ...event.value
              };
            }
          })
        },
        PERSIST_PROGRESS: {
          actions: [
            (_, event) => updateHistory(event.value),
            (_, event) => updateCachedHistory([event.value]),
          ],
        },
        VOLUME_SET: {
          actions: [
            assign({ volume: (_, event) => event.value }),
            (_, event) => updateCachedVolume(event.value),
            (context, event) => context.player.volume(event.value),
          ],
        },
      },
      entry: [
        (context) => context.player.play(),
      ],
      invoke: {
        src: (context) => (send) => {
          const contextTimer = setInterval(() => {
            const position = context.player.seek();
            const progress = calculateProgress(context);

            send({
              type: "UPDATE_CONTEXT",
              value: {
                progress,
                position,
              },
            });
          }, 1000 * contextInterval);

          const persistTimer = setInterval(() => {
            const progress = calculateProgress(context);
            send({
              type: "PERSIST_PROGRESS",
              value: {
                id: context.playing.id,
                progress,
              },
            });
          }, 1000 * persistInterval);

          return () => {
            clearInterval(persistTimer);
            clearInterval(contextTimer);
          };
        },
      },
    },
  },
});

const playerSignal = signal(playerMachine.getInitialState(initialState));

const playerService = interpret(playerMachine)
  .onTransition((state) => playerSignal.value = state)
  .start();

export { playerService, playerSignal };
