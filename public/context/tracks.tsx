import { useAsset } from 'use-asset';
import { createContext, VNode } from 'preact';
import { getTracks } from '../helpers/tracks';

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