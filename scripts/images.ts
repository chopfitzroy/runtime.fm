import type { TrackCollection } from '../public/helpers/tracks';

import * as path from 'path';
import * as fsSync from 'fs';
import * as fsAsync from 'fs/promises';

import download from 'image-downloader';

import { pocketbase } from '../public/helpers/pocketbase';

const createFeed = async () => {
  const main = path.join(__dirname, '../public/art');
  const thumb = path.join(main, './thumb');

  const tracks = await pocketbase.collection('tracks').getFullList<TrackCollection>(200, {
    sort: '-created',
  });


  if (!fsSync.existsSync(main)) {
    await fsAsync.mkdir(main);
  }

  if (!fsSync.existsSync(thumb)) {
    await fsAsync.mkdir(thumb);
  }


  for (const track of tracks) {
    await Promise.all([
      download.image({
        url: `https://art.runtime.fm/api/album-art?id=${track.id}`,
        dest: path.join(main, `/${track.id}.png`),
      }),
      download.image({
        url: `https://art.runtime.fm/api/album-art?id=${track.id}&size=500`,
        dest: path.join(thumb, `/${track.id}.png`),
      })
    ])
  }
}

createFeed();
