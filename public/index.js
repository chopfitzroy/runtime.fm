import withTwind from '@twind/wmr';

import { App } from './app';

const { hydrate, prerender } = withTwind((data) => <App {...data} />)

hydrate(<App />);

export { prerender };