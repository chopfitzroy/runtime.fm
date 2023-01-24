import { useState } from 'preact/hooks';

const CACHE = new Map();

export const usePromise = <T = any>(key: string, handler: (key?: string) => Promise<T>) => {
	type ResolvedValue = Awaited<ReturnType<typeof handler>>;
	
	const [_, update] = useState<unknown>(null);

	let value = CACHE.get(key);

	if (value === undefined) {
		value = handler(key);

		CACHE.set(key, value);

		value.then(
			(res: ResolvedValue) => update((value.res = res)),
		);
	}

	if (value.res) {
		return value.res as ResolvedValue;
	};


	throw value;
}


