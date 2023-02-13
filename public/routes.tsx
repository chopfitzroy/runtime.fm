import Home from './pages/home';
import Signin from './pages/signin';
import Signup from './pages/signup';
import NotFound from './pages/_404';

import { Router, Route, lazy } from 'preact-iso';

const ShowNotes = lazy(() => import('./pages/show-notes'));

export function Routes() {
  return (
      <Router>
        <Route path="/" component={Home} />
        <Route path="/signin" component={Signin} />
        <Route path="/signup" component={Signup} />
        <Route path="/show-notes/:id" component={ShowNotes} />
        <Route default component={NotFound} />
      </Router>
  )
}