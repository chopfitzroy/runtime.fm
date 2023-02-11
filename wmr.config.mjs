import { defineConfig } from 'wmr';

// Full list of options: https://wmr.dev/docs/configuration
export default defineConfig({
	port: 8080,
	host: '0.0.0.0',
	alias: {
		react: 'preact/compat',
		'react-dom': 'preact/compat',
	},
});
