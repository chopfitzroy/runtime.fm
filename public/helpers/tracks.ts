import { playerService } from '../lib/audio-player-machine';
import { Collection, createFileUrlFromRecord, pocketbase } from './pocketbase'

export type TrackCollection = Collection<{
  title: string;
  audio: string;
  description: string;
}>;

export const getTrack = async (id: string) => {
  const track = await pocketbase.collection('tracks').getOne<TrackCollection>(id);

  return {
    ...track,
    url: createFileUrlFromRecord(track, 'audio')
  }
}

export const getTracks = async (_?: string) => {
  const tracks = await pocketbase.collection('tracks').getFullList<TrackCollection>(200, {
    sort: '-created',
  });
  return tracks.map(track => {
    const url = createFileUrlFromRecord(track, 'audio');
    return {
      ...track,
      url,
      select: (e: MouseEvent) => {
        e.preventDefault();
        playerService.send({ type: 'SELECT_TRACK', value: { id: track.id, url } })
      }
    }
  });
};
