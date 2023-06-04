import withTwind from '@twind/wmr';

import { App } from './app';
import { inject } from '@vercel/analytics';

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
    '@font-face': [
      {
        fontFamily: 'Karla',
        fontWeight: '400',
        src: 'url(/fonts/Karla-Regular.ttf) format("truetype")',
      },
      {
        fontFamily: 'Karla',
        fontWeight: '700',
        src: 'url(/fonts/Karla-Bold.ttf) format("truetype")',
      },
      {
        fontFamily: 'Inconsolata',
        fontWeight: '400',
        src: 'url(/fonts/Inconsolata-Regular.ttf) format("truetype")',
      },
      {
        fontFamily: 'Inconsolata',
        fontWeight: '700',
        src: 'url(/fonts/Inconsolata-Bold.ttf) format("truetype")',
      },
    ]
  }
}, (data) => <App {...data} />)

inject();
hydrate(<App />);

export { prerender };