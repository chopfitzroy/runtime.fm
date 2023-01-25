import { useState } from 'preact/hooks';

const CACHE = new Map();

// @TODO
// - Would love to make this more 'functional' eventually
export const usePromise = <T = any>(key: string, handler: (key: string) => Promise<T>) => {
	type PendingValue = ReturnType<typeof handler>;
	type ResolvedValue = Awaited<PendingValue>;

	const [_, update] = useState<unknown>(null);

	let request = CACHE.get(key);

	if (request === undefined) {
		request = handler(key);

		CACHE.set(key, request);

		// For some reason try/catch here doesn't work
		// - `update` seems to lose scope
		request.then(
			(resolved: ResolvedValue) => update((request.resolved = resolved))
		);
	}

	if (request.resolved) {
		return request.resolved as ResolvedValue;
	};


	throw request as PendingValue;
}


