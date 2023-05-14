import type { TrackCollection } from '../public/helpers/tracks';

import * as fs from 'fs/promises';

import { Podcast } from 'podcast';
import { createFileUrlFromRecord, pocketbase } from '../public/helpers/pocketbase';

const createFeed = async () => {
	const tracks = await pocketbase.collection('tracks').getFullList<TrackCollection>(200, {
		sort: '-created',
	});

	const feed = new Podcast({
		title: 'Runtime FM',
		description: 'Runtime FM is a podcast for developers, designers, dev ops, dev rel, and more.',
		feedUrl: 'https://runtime.fm/rss.xml',
		siteUrl: 'https://runtime.fm',
		imageUrl: 'https://runtime.fm/icon.png',
		docs: 'https://runtime.fm/rss/docs.html',
		author: 'Otis Sutton',
		managingEditor: 'Otis Sutton',
		webMaster: 'Otis Sutton',
		copyright: '2023 Otis Sutton',
		language: 'en',
		categories: ['Technology', 'Tech News'],
		pubDate: 'June 1, 2023 04:00:00 GMT',
		ttl: 60,
		itunesAuthor: 'Otis Sutton',
		itunesSubtitle: 'Runtime FM',
		itunesSummary: 'Runtime FM is a podcast for developers, designers, dev ops, dev rel, and more.',
		itunesOwner: { name: 'Otis Sutton', email: 'hello@otis.engineer' },
		itunesExplicit: false,
		itunesCategory: [{
			text: 'Technology',
		}],
	});

	tracks.forEach(track => {
		feed.addItem({
			title: track.title,
			description: track.description,
			url: createFileUrlFromRecord(track, 'audio'),
			guid: track.id,
			categories: ['Technology'],
			author: 'Otis Sutton',
			date: track.created,
			// @TODO
			// - What is this?
			// enclosure: { url: '...', file: 'path-to-file' },
			itunesImage: `https://art.runtime.fm/api/album-art?id=${track.id}`,
			itunesAuthor: 'Otis Sutton',
			itunesExplicit: false,
			itunesSubtitle: track.title,
			itunesSummary: track.description,
			itunesDuration: 12345,
			itunesNewFeedUrl: 'https://runtime.fm/feed.rss',
		});
	});

	// @TODO
	// - Write to file
	const xml = feed.buildXml();
	await fs.writeFile('./dist/rss.xml', xml);
}

createFeed();
