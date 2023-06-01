import Home from './pages/home';
import About from './pages/about';
import Signin from './pages/signin';
import Signup from './pages/signup';
import NotFound from './pages/_404';

import { Router, Route, lazy } from 'preact-iso';

const ShowNotes = lazy(() => import('./pages/show-notes'));

export function Routes() {
  return (
      <Router>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
        <Route path="/notes/:episode" component={ShowNotes} />
        <Route default component={NotFound} />
      </Router>
  )
}