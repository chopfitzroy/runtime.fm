import { useState } from 'preact/hooks';

const CACHE = new Map();

async function load(url: string) {
	const res = await fetch(url);
	const data = await res.json();
	return data;
}

// @NOTE
// - Get around pre-render issue
// - https://github.com/preactjs/wmr/discussions/950
export function useContent(url: string) {
	const [_, update] = useState<unknown>(0);
	let value = CACHE.get(url);


	if (!value) {
		value = load(url);
		CACHE.set(url, value);
		value.then(
			(res: unknown) => update((value.res = res)),
			(rej: unknown) => update((value.rej = rej))
		);
	}

	if (value.res) return value.res;
	if (value.rej) throw value.rej;

	throw value;
}
