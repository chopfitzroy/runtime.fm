import { Howl, Howler } from "howler";
import { signal } from "@preact/signals";
import { isAfter, parseJSON } from "date-fns";
// import { restorePlayer } from "../utils/playerRestore.ts";
// import { cacheVolume } from "../storage/playerPreferences.ts";
import { AnyEventObject, assign, createMachine, interpret } from "xstate";
import type { History } from '../helpers/history';
import { updateHistory } from '../helpers/history';
import { getTrack } from "../helpers/tracks";
// import {
//   cacheAllPositionAndProgress,
//   cacheSinglePositionAndProgress,
// } from "../storage/playerHistory.ts";

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

const getProgress = (context: PlayerMachineContext) => {
  const position = context.player.seek();
  const duration = context.player.duration();
  const value = (position / duration) * 100;
  const progress = Math.round(value * 100 + Number.EPSILON) / 100;

  return progress;
};

const getPosition = (context: PlayerMachineContext) => {
  const progress = context.playing.progress;
  const duration = context.player.duration();

  return duration * progress;
};

const getMostRecentPlaying = (context: PlayerMachineContext) => {
  const [recent] = context.history.sort((a, b) => {
    return isAfter(parseJSON(a.updated), parseJSON(b.updated)) ? 1 : -1;
  });

  if (recent === undefined) {
    throw new Error(`Unable to find recently played, aborting`);
  }

  return getTrack(recent.id);
};

// @TODO
// - Add `populated` state
// - Add entry event to `paused`
// - Add `PLAY` listener to `populated` (will jump to `loading`)
// - Add `PLAY` listener on `paused` (will jump straight to `playing`)
const playerMachine = createMachine<PlayerMachineContext>({
  predictableActionArguments: true,
  context: createInitialContext(),
  initial: initialState,
  on: {
    PLAY: {
      target: "loading",
    },
    SEEK: {
      // @TODO
      // - This probably looks different for `paused` and `playing`
      actions: [
        updateCurrentPlayable,
      ],
    },
    VOLUME_SET: {
      actions: [
        assign({ volume: (_, event) => event.value }),
        (_, event) => cacheVolume(event.value),
      ],
    },
    SELECT_TRACK_INFO: {
      target: "loading",
      actions: [
        assign((context) => createInitialContext(context)),
        getPlayableById,
      ],
    },
  },
  states: {
    // @NOTE
    // - Unfortunately it's impossible to dynamically get the progress here
    // - This is because we can't read the duration of the audio file on page load
    // - https://github.com/goldfire/howler.js/issues/1154
    // - To get around this we persist the progress as well as the duration
    populating: {
      invoke: {
        src: restorePlayer,
        onDone: {
          target: "paused",
          actions: [
            assign({ volume: (_, event) => event.data.volume }),
            assign({ playables: (_, event) => event.data.playables }),
            getLatestPlayable,
            (_, event) => cacheVolume(event.data.volume),
            (_, event) => cacheAllPositionAndProgress(event.data.playables),
          ],
        },
        onError: {
          target: "failed",
        },
      },
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
            const playable = getCurrentPlayable(context);
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
