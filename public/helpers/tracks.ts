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

export const getTracks = async () => {
  const tracks = await pocketbase.collection('tracks').getFullList<TrackCollection>(200, {
    sort: '-created',
  });
  return tracks.map(track => ({
    ...track,
    url: createFileUrlFromRecord(track, 'audio')
  }));
};
