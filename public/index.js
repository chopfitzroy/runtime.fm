import withTwind from '@twind/wmr';

import { App } from './app';

const { hydrate, prerender } = withTwind({
  theme: {
    extend: {
      fontFamily: (theme) => {
        return {
          sans: ['Karla', ...theme('fontFamily').sans],
          mono: ['Inconsolata', ...theme('fontFamily').mono],
        }
      }
    },
  },
  preflight: {
    // Import external stylesheet
    '@import': `url('https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;700&family=Karla:wght@400;700&display=swap')`
  }
}, (data) => <App {...data} />)

hydrate(<App />);

export { prerender };