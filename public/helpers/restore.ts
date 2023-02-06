import localforage from "localforage";
import { IS_SERVER } from "./environment";
import { getCachedHistory, getHistory } from "./history";
import { trap } from "./trap";

const restoreTable = localforage.createInstance({
	name: 'restore',
	storeName: 'restoreTable',
	description: 'Store information required for player restore'
});

const getCachedVolume = () => {
	if (IS_SERVER) {
		throw new Error("Cannot use cache in server environment, aborting");
	}

	return restoreTable.getItem('volume');
}

const updateCachedVolume = async (volume: number) => {
	if (IS_SERVER) {
		throw new Error("Cannot use cache in server environment, aborting");
	}

	try {
		await restoreTable.setItem('volume', volume);
	} catch (err) {
		console.info(`Failed to cache volume, aborting`, err);
	}
}

const restoreHistory = async () => {
	const getHistorySafe = trap(getHistory);
	const getCachedHistorySafe = trap(getCachedHistory);

	const [realHistory] = await getHistorySafe();

	if (realHistory !== undefined) {
		return realHistory;
	}

	const [cachedHistory] = await getCachedHistorySafe();

	if (cachedHistory !== undefined) {
		return cachedHistory;
	}

	return [];
};

const restoreVolume = async () => {
	const getCachedVolumeSafe = trap(getCachedVolume);

	const [cachedVolume] = await getCachedVolumeSafe();

	if (cachedVolume !== undefined) {
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
	getCachedVolume,
	updateCachedVolume
}
