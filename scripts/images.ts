import type { TrackCollection } from '../public/helpers/tracks';

import * as path from 'path';
import * as fsSync from 'fs';
import * as fsAsync from 'fs/promises';

import download from 'image-downloader';

import { pocketbase } from '../public/helpers/pocketbase';

const createFeed = async () => {
  const directory = path.join(__dirname, '../dist/art');

  const tracks = await pocketbase.collection('tracks').getFullList<TrackCollection>(200, {
    sort: '-created',
  });


  if (!fsSync.existsSync(directory)) {
    await fsAsync.mkdir(directory);
  }

  for (const track of tracks) {
    await download.image({
      url: `https://art.runtime.fm/api/album-art?id=${track.id}`,
      dest: path.join(directory, `/${track.id}.png`),
    })
  };
}

createFeed();
