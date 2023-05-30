import * as fs from 'fs/promises';

const createFile = async () => {
	const config = {
		headers: [{
			source: "/(.*)",
			headers: [
				{
					key: "Last-Modified",
					// @NOTE
					// - Always set the last modified to right now when the site is being generated
					value: new Date().toUTCString()
				},
			]
		}]
	};

	await fs.writeFile('./vercel.json', JSON.stringify(config));
}

createFile();
