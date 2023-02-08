import { Collection, pocketbase } from './pocketbase'
import { IS_SERVER } from './environment';
import type { Playable } from '../lib/audio-player-machine';
import localforage from 'localforage';

export type History = Collection<{
  user: string;
  track: string;
  progress: number;
}>;

const historyTable = localforage.createInstance({
  name: "history",
  storeName: "historyTable",
  description: "Store the history",
});

const getCachedHistory = async () => {
  if (IS_SERVER) {
    throw new Error("Cannot use cache in server environment, aborting");
  }

  const keys = await historyTable.keys();

  const values = keys.map(async (key: string) => ({
    id: key,
    progress: historyTable.getItem(key)
  }));

  return await Promise.all(values);
};

const updateCachedHistory = async (history: History[]) => {
  if (IS_SERVER) {
    console.log("Cannot use cache in server environment, aborting");
    return;
  }
  try {
    await Promise.all(history.map(item => historyTable.setItem(item.id, item.progress)));
  } catch (err) {
    console.info(`Failed to cache position and progress, aborting`, err);
  }
}

const getHistory = async () => {
  const model = pocketbase.authStore.model;

  if (model === null) {
    throw new Error("User not logged in, unable to fetch history, aborting");
  }

  const user = model.id;
  const filter = `user="${user}"`;

  const records = await pocketbase.collection("history")
    .getFullList<History>(200, { filter });

  return records;
};

const createHistory = async (playable: Playable) => {
  try {
    const model = pocketbase.authStore.model;

    if (model === null) {
      throw new Error("User not logged in, unable to create history, aborting");
    }

    const user = model.id;
    const data = {
      user,
      track: playable.id,
      progress: playable.progress
    };

    const record = await pocketbase.collection("history").create(data);
    return record;
  } catch (err) {
    console.info(
      `Something went wrong when trying to create "${playable.id}", aborting`,
      err,
    );
  }
};

const updateHistory = async (playable: Playable) => {
  const model = pocketbase.authStore.model;

  if (model === null) {
    console.info(`User is not logged in, no way to write to server, aborting`);
    return;
  }

  try {
    const user = model.id;
    const filter = `user="${user}" && track="${playable.id}"`;

    const { id: existingId, track } = await pocketbase.collection("history")
      .getFirstListItem(filter);

    const record = await pocketbase.collection("history").update(existingId, {
      user,
      track,
      progress: playable.progress
    });

    return record;
  } catch (err) {
    if (err.status !== 404) {
      console.info(
        `Something went wrong when trying to update "${playable.id}", aborting`,
        err,
      );
      return;
    }

    return createHistory(playable);
  }
};

export { getHistory, updateHistory, getCachedHistory, updateCachedHistory };
