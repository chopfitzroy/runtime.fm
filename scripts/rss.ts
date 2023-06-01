import type { TrackCollection } from '../public/helpers/tracks';

import * as fs from 'fs/promises';

import ufs from "url-file-size";

import { Podcast } from 'podcast';
import { getAudioDurationInSeconds } from 'get-audio-duration';
import { createFileUrlFromRecord, pocketbase } from '../public/helpers/pocketbase';

const createFeed = async () => {
	const tracks = await pocketbase.collection('tracks').getFullList<TrackCollection>(200, {
		sort: '-created',
	});

	const [latest] = tracks;

	const feed = new Podcast({
		title: 'Runtime FM',
		description: 'Runtime FM is a podcast for software engineers interested in web development.',
		feedUrl: 'https://runtime.fm/rss.xml',
		siteUrl: 'https://runtime.fm',
		imageUrl: `https://runtime.fm/art/${latest.id}.png`,
		docs: 'https://github.com/chopfitzroy/runtime.fm',
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
		itunesSummary: 'Runtime FM is a podcast for software engineers interested in web development.',
		itunesOwner: { name: 'Otis Sutton', email: 'hello@otis.engineer' },
		itunesExplicit: false,
		itunesCategory: [{
			text: 'Technology',
		}],
	});

	for (const track of tracks) {
		feed.addItem({
			title: track.title,
			description: track.description,
			url: `https://runtime.fm/show-notes/${track.id}`,
			guid: track.id,
			categories: ['Technology'],
			author: 'Otis Sutton',
			date: track.created,
			enclosure: {
				url: createFileUrlFromRecord(track, 'audio'),
				type: 'audio/mpeg',
				size: await ufs(createFileUrlFromRecord(track, 'audio')),
			},
			itunesImage: `https://runtime.fm/art/${track.id}.png`,
			itunesAuthor: 'Otis Sutton',
			itunesExplicit: false,
			itunesSubtitle: track.title,
			itunesSummary: track.description,
			itunesDuration: await getAudioDurationInSeconds(createFileUrlFromRecord(track, 'audio')),
			itunesNewFeedUrl: 'https://runtime.fm/rss.xml',
		});
	};

	// @TODO
	// - Write to file
	const xml = feed.buildXml();
	await fs.writeFile('./dist/rss.xml', xml);
}

createFeed();
