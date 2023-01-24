import PocketBase from 'pocketbase';

import { useState } from 'preact/hooks';

const PB = new PocketBase('https://api.coffeeandcode.app');

const CACHE = new Map();

const load = async (url: string) => {
	const res = await fetch(url);
	const data = await res.json();
	return data;
}

// @NOTE
// - Get around pre-render issue
// - https://github.com/preactjs/wmr/discussions/950
export const useFetch = <T = any>(url: string): T => {
	const [_, update] = useState<unknown>(0);
	let value = CACHE.get(url);


	if (!value) {
		value = load(url);
		CACHE.set(url, value);
		// @TODO
		// - Come up with something better than this...
		value.then(
			(res: unknown) => update((value.res = res)),
			(rej: unknown) => update((value.rej = rej))
		);
	}

	if (value.res) {
		CACHE.delete(url);
		return value.res
	};

	if (value.rej) {
		CACHE.delete(url);
		throw value.rej
	};

	throw value;
}

export const usePocketBase = <T = any>(collection: string): T[] => {
	const [_, update] = useState<unknown>(0);
	let value = CACHE.get(collection);

	if (!value) {
		value = PB.collection(collection).getFullList(200, {
			sort: '-created',
		});
		CACHE.set(collection, value);
		value.then(
			(res: unknown) => update((value.res = res)),
			(rej: unknown) => update((value.rej = rej))
		);
	}

	if (value.res) {
		CACHE.delete(collection);
		return value.res
	};

	if (value.rej) {
		CACHE.delete(collection);
		throw value.rej
	};

	throw value;
}

