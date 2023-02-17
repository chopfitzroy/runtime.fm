import { Readable } from 'stream';
import * as fs from 'fs/promises';

import { SitemapStream, streamToPromise } from 'sitemap';
import { pocketbase } from '../public/helpers/pocketbase';
import { TrackCollection } from '../public/helpers/tracks';

const createMap = async () => {
  const tracks = await pocketbase.collection('tracks').getFullList<TrackCollection>(200, {
    sort: '-created',
  });

  const notes = tracks.map(track => ({
    url: `/show-notes/${track.id}`,
    changefreq: 'weekly',
    priority: 0.5
  }))

  const links = [
    { url: '/', changefreq: 'weekly', priority: 1 },
    { url: '/signup', changefreq: 'monthly', priority: 0.1 },
    { url: '/signin', changefreq: 'monthly', priority: 0.1 },
    ...notes,
  ]

  const stream = new SitemapStream({ hostname: 'https://runtime.fm' })

  const buffer = await streamToPromise(Readable.from(links).pipe(stream))
  const xml = buffer.toString();
  await fs.writeFile('./dist/sitemap.xml', xml);
}

createMap();
