import localforage from "localforage";
import { IS_SERVER } from "./environment";
import { getCachedHistory, getHistory } from "./history";
import { trap } from "./trap";

const restoreTable = localforage.createInstance({
	name: 'restore',
	storeName: 'restoreTable',
	description: 'Store information required for player restore'
});

const getCachedVolume = async () => {
	if (IS_SERVER) {
		throw new Error("Cannot use cache in server environment, aborting");
	}

	return await restoreTable.getItem('volume') as number;
}

const updateCachedVolume = async (volume: number) => {
	if (IS_SERVER) {
		console.log("Cannot use cache in server environment, aborting");
		return;
	}

	try {
		await restoreTable.setItem('volume', volume);
	} catch (err) {
		console.info(`Failed to cache volume, aborting`, err);
	}
}

const restoreHistory = async (_?: string) => {
	const getHistorySafe = trap(getHistory);
	const getCachedHistorySafe = trap(getCachedHistory);

	const [realHistory] = await getHistorySafe();

	if (realHistory !== null && realHistory !== undefined) {
		return realHistory;
	}

	const [cachedHistory] = await getCachedHistorySafe();

	if (cachedHistory !== null && cachedHistory !== undefined) {
		return cachedHistory;
	}

	return [];
};

const restoreVolume = async () => {
	const getCachedVolumeSafe = trap(getCachedVolume);

	const [cachedVolume] = await getCachedVolumeSafe();

	if (cachedVolume !== null && cachedVolume !== undefined) {
		return cachedVolume;
	}
	
	return 0.5;
};

const restorePlayer = async () => {
	const volume = await restoreVolume();
	const history = await restoreHistory();

	return {
		volume,
		history
	};
};

export {
	restorePlayer,
	restoreVolume,
	restoreHistory,
	getCachedVolume,
	updateCachedVolume
}
