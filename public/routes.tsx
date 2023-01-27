import PocketBase from 'pocketbase';
import NotFound from './pages/_404.js';
import Home from './pages/home/index.js';

import { createContext } from 'preact';
import { Router, Route, lazy } from 'preact-iso';
import { useErrorBoundary } from "preact/hooks";
import { useAsset } from 'use-asset';

const PB = new PocketBase('https://api.coffeeandcode.app');

const getTracks = () => PB.collection('tracks').getFullList<{ audio: string }>(200, {
  sort: '-created',
})

const About = lazy(() => import('./pages/about/index.js'));
const ShowNotes = lazy(() => import('./pages/show-notes'));

export const Tracks = createContext<Awaited<ReturnType<typeof getTracks>>>([]);

export function Routes() {
  const tracks = useAsset(getTracks)

  const [error, reset] = useErrorBoundary();

  if (error) {
    return (
      <div>
        <p>{error.message}</p>
        <button onClick={reset}>Reset</button>
      </div>
    )
  }

  return (
    <Tracks.Provider value={tracks}>
      <Router>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/show-notes/:id" component={ShowNotes} />
        <Route default component={NotFound} />
      </Router>
    </Tracks.Provider>
  )
}