import { useAsset } from 'use-asset';
import { createContext, VNode } from 'preact';
import { Collection, pocketbase } from '../helpers/pocketbase';

export type TrackCollection = Collection<{
  title: string;
  audio: string;
  description: string;
}>;

const getTracks = async () => {
  const tracks = await pocketbase.collection('tracks').getFullList<TrackCollection>(200, {
    sort: '-created',
  });
  return tracks.map(track => ({
    ...track,
    url: `https://api.coffeeandcode.app/api/files/${track.collectionId}/${track.id}/${track.audio}`
  }));
};

export const Tracks = createContext<Awaited<ReturnType<typeof getTracks>>>([]);

interface TracksProviderProps {
  children?: VNode | VNode[]
}

export function TracksProvider({ children }: TracksProviderProps) {
  const tracks = useAsset(getTracks)

  return (
    <Tracks.Provider value={tracks}>
      {children}
    </Tracks.Provider>
  )
}