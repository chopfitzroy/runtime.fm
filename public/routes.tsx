import NotFound from './pages/_404.js';
import Home from './pages/home/index.js';

import { Router, Route, lazy } from 'preact-iso';

const About = lazy(() => import('./pages/about/index.js'));
const ShowNotes = lazy(() => import('./pages/show-notes'));

export function Routes() {
  return (
      <Router>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/show-notes/:id" component={ShowNotes} />
        <Route default component={NotFound} />
      </Router>
  )
}