import withTwind from '@twind/wmr';

import { App } from './app';
import { inject } from '@vercel/analytics';
import { toStatic } from 'hoofd';
import typography from '@twind/typography';

const { hydrate, prerender: internal } = withTwind({
  theme: {
    extend: {
      fontFamily: (theme) => {
        return {
          sans: ['Karla', ...theme('fontFamily').sans],
          mono: ['Inconsolata', ...theme('fontFamily').mono],
        }
      },
    },
  },
  plugins: typography(),
  variants: {
    'heading': '& h1,h2,h3,h4,h5,h6',
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

// @ts-expect-error
async function prerender(data) {

  const result = await internal(data);

  const head = toStatic();

  const { links = [], metas = [], scripts = [] } = head;

  const elements = new Set([
    // @ts-expect-error
    ...result.head.elements,
    ...links.map(props => ({ type: 'link', props })),
    ...metas.map(props => ({ type: 'meta', props })),
    ...scripts.map(props => ({ type: 'script', props }))
  ]);

  return {
    ...result,
    head: {
      lang: head.lang,
      title: head.title,
      elements
    }
  };
};

inject();
hydrate(<App />);

export { prerender };
