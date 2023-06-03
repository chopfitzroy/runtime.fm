import { useState } from 'preact/hooks';

const CACHE = new Map();

export const usePromise = <T extends unknown>(key: string, handler: (key: string) => Promise<T>) => {
	const [, update] = useState<unknown>();

	let request = CACHE.get(key);

	if (request === undefined) {
		request = handler(key);

		CACHE.set(key, request);

		request.then(
			(resolved: T) => update((request.resolved = resolved)),
			(rejected: unknown) => update((request.rejected = rejected))
		);
	}

	if (request.resolved) {
		return request.resolved as T;
	};

	if (request.rejected) {
		throw request.rejected as unknown;
	}


	throw request as Promise<T>;
}