import PocketBase from 'pocketbase';

import { useAsset } from 'use-asset';
import { createContext, VNode } from 'preact';

const PB = new PocketBase('https://api.coffeeandcode.app');

const getTracks = () => PB.collection('tracks').getFullList<{ audio: string }>(200, {
  sort: '-created',
})
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