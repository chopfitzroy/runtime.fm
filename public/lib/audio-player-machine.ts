import { History, updateCachedHistory } from '../helpers/history';

import { Howl, Howler } from "howler";
import { signal } from "@preact/signals";
import { isAfter, parseJSON } from "date-fns";
import { assign, createMachine, interpret } from "xstate";
import { updateHistory } from '../helpers/history';
import { getTrack } from "../helpers/tracks";
import { restorePlayer, updateCachedVolume } from '../helpers/restore';

export interface Playable {
  id: string;
  url: string;
  progress: number;
}

interface PlayerMachineContext {
  player: Howl;
  volume: number;
  playing: Playable;
  history: History[];
}

const initialState = "populating";
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
  const progress = context.playing.progress;
  const duration = context.player.duration();

  return duration * progress;
};

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
    progress: recent.progress
  }
};

// @TODO
// - Add `restored` state
// - Add `restoring` state
// - Add entry event to `paused`
// - Add `PLAY` listener to `populated` (will jump to `loading`)
// - Add `PLAY` listener on `paused` (will jump straight to `playing`)
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
    SELECT_TRACK_INFO: {
      target: "loading",
      actions: [
        assign((context) => createInitialContext(context)),
        assign({ playing: (_, event) => event.data })
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
          target: "populating",
          actions: [
            assign({ volume: (_, event) => event.data.volume }),
            assign({ history: (_, event) => event.data.history }),
            (_, event) => updateCachedVolume(event.data.volume),
            (_, event) => updateCachedHistory(event.data.history),
          ],
        },
        onError: {
          target: "failed",
        },
      },
    },
    populating: {
      invoke: {
        src: getMostRecentPlaying,
        onDone: {
          target: "paused",
          actions: [
            assign({ playing: (_, event) => event.data })
          ]
        },
        onError: {
          target: "stopped"
        }
      }
    },
    failed: {
      type: "final",
      // @TODO
      // - Tell the user to refresh the page
    },
    paused: {
      // @TODO
      // - Move relevant events here
    },
    loading: {
      entry: () => Howler.unload(),
      invoke: {
        src: (context) =>
          new Promise((res) => {
            const playable = context.playing;
            const player = new Howl({
              src: [playable.url],
              html5: true,
              volume: context.volume,
            });

            player.on("load", () => res(player));
          }),
        onDone: {
          target: "playing",
          actions: assign({ player: (_, event) => event.data }),
        },
        onError: {
          target: "failed",
        },
      },
    },
    playing: {
      on: {
        PAUSE: {
          target: "paused",
        },
        UPDATE_CONTEXT: {
          actions: updateCurrentPlayable,
        },
        PERSIST_POSITION_AND_PROGRESS: {
          actions: [
            (_, event) => updateHistory(event.value),
            (_, event) => cacheSinglePositionAndProgress(event.value),
          ],
        },
        VOLUME_SET: {
          actions: [
            assign({ volume: (_, event) => event.value }),
            (context, event) => context.player.volume(event.value),
            (_, event) => cacheVolume(event.value),
          ],
        },
      },
      exit: [
        // @NOTE
        // - Unfortunately this needs to be done here
        // - This is to get around audio context issues on page load
        (context) => context.player.pause(),
      ],
      entry: [
        (context) => context.player.seek(getCurrentPosition(context)),
        (context) => context.player.play(),
      ],
      invoke: {
        src: (context) => (send) => {
          const contextTimer = setInterval(() => {
            const { position, progress } = getPositionAndProgress(context);

            send({
              type: "UPDATE_CONTEXT",
              value: {
                progress,
                position,
              },
            });
          }, 1000 * contextInterval);

          const persistTimer = setInterval(() => {
            const { position, progress } = getPositionAndProgress(context);
            send({
              type: "PERSIST_POSITION_AND_PROGRESS",
              value: {
                id: context.id,
                progress,
                position,
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
