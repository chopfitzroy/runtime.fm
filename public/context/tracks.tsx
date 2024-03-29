import { createContext, VNode } from 'preact';
import { getTracks } from '../helpers/tracks';
import { restoreHistory } from '../helpers/restore';
import { checkFinished } from '../helpers/misc';
import { usePromise } from '../hooks/use-promise';

type State = 'waiting' | 'continue' | 'finished';
type Track = Awaited<ReturnType<typeof getTracks>>[number]
type History = Awaited<ReturnType<typeof restoreHistory>>[number]
type Hydrated = Track & History & {
  state: State
};

export const Tracks = createContext<Hydrated[]>([]);

interface TracksProviderProps {
  children?: VNode | VNode[]
}

export function TracksProvider({ children }: TracksProviderProps) {
  const tracks = usePromise("tracks", getTracks)
  const history = usePromise("history", restoreHistory);

  const hydrated = tracks.map(track => {
    const match = history.find(item => item.id === track.id);

    if (match === undefined) {
      return {
        ...track,
        state: 'waiting' as State,
        progress: 0
      };
    }

    return {
      ...track,
      state: checkFinished(match.progress) ? 'finished' : 'continue' as State,
      progress: match.progress
    }
  })

  return (
    <Tracks.Provider value={hydrated}>
      {children}
    </Tracks.Provider>
  )
}