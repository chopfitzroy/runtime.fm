import withTwind from '@twind/wmr';

import { App } from './app';

const { hydrate, prerender } = withTwind({
  theme: {
    extend: {
      fontFamily: (theme) => {
        return {
          sans: ['Inconsolata', ...theme('fontFamily').sans],
        }
      }
    },
  },
  preflight: {
    // Import external stylesheet
    '@import': `url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;300;400;500;600;700;800;900&display=swap')`
  }
}, (data) => <App {...data} />)

hydrate(<App />);

export { prerender };