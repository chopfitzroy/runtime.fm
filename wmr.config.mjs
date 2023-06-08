import path from "path";

import { defineConfig } from 'wmr';
import { promises as fs } from "fs";

// @NOTE
// - Eventually this will be PR'd to the official directory plugin
// - https://github.com/preactjs/wmr/issues/957

/**
 * @param {import("wmr").Options} options
 * @param {string} options.root
 * @returns {import('rollup').Plugin}
 */
function directoryPlugin(options) {
	const PREFIX = "dir:";
	const INTERNAL = "\0dir:";

	options.plugins.push({
		name: "directory",
		async resolveId(id, importer) {
			if (!id.startsWith(PREFIX)) return;

			id = id.slice(PREFIX.length);
			let resolved = await this.resolve(id, importer, { skipSelf: true });
			if (!resolved) {
				const r = path.join(path.dirname(importer), id);
				const stats = await fs.stat(r);
				if (!stats.isDirectory()) throw Error(`Not a directory.`);
				resolved = { id: r };
			}
			return INTERNAL + (resolved ? resolved.id : id);
		},
		async load(id) {
			if (!id.startsWith(INTERNAL)) return;

			// remove the "\dir:" prefix and convert to an absolute path:
			id = id.slice(INTERNAL.length);
			let dir = id.split(path.posix.sep).join(path.sep);
			if (!options.prod) {
				dir = path.join(options.root, dir);
			}

			// watch the directory for changes:
			this.addWatchFile(dir);

			// generate a module that exports the directory contents as an Array:
			const files = (await fs.readdir(dir)).filter((d) => d[0] != ".");
			return `export default ${JSON.stringify(files)}`;
		},
	});
}

// Full list of options: https://wmr.dev/docs/configuration
export default defineConfig(config => {
	directoryPlugin(config);

	return {
		port: 8080,
		host: '0.0.0.0',
		alias: {
			react: 'preact/compat',
			'react-dom': 'preact/compat',
		}
	}
});
