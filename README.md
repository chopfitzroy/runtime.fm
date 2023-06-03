# Runtime FM 🎤

Single page app that powers the [runtime.fm](https://runtime.fm) website! 

### Design

What started out as wireframing very quickly became quite similar to [neo brutalist](https://bootcamp.uxdesign.cc/the-neubrutalism-or-neo-brutalism-ui-design-trend-641714825fed) design.

Since then we have become quite found of this style of design and decided to continue in this direction.

### Stack

The site is deployed to [Vercel](https://vercel.com/) and the API is a [PocketBase](https://pocketbase.io/) instance running on [Digital Ocean](https://www.digitalocean.com/).

Other tools include:

- [Twind](https://twind.dev/)
- [XState](https://xstate.js.org/)
- [sitemap](https://github.com/ekalinin/sitemap.js)
- [Signals](https://preactjs.com/guide/v10/signals/)
- [Podcast](https://github.com/maxnowack/node-podcast)
- [howler.js](https://howlerjs.com/)

For API setup see this [repo](https://github.com/chopfitzroy/admin.runtime.fm/).

### Pre-rendering

We make extensive use of pre-rendering. To do this effectively we have to fetch data in a [suspense friendly](https://github.com/preactjs/wmr/tree/main/packages/preact-iso#prerenderjs) way.

Initially we tried to do this with an _off the shelf_ solution, unfortunately we have a number of issues ([#950](https://github.com/preactjs/wmr/discussions/950), [#957](https://github.com/preactjs/wmr/issues/957)) when doing this, a list of the solutions we used can be found below:

- [`pmndrs/use-asset`](https://github.com/pmndrs/use-asset)
- [`dai-shi/react-hooks-fetch`](https://github.com/dai-shi/react-hooks-fetch)
- [`dai-shi/react-suspense-fetch`](https://github.com/dai-shi/react-suspense-fetch)
- [`CharlesStover/fetch-suspense`](https://github.com/CharlesStover/fetch-suspense)
- [`vigzmv/react-promise-suspense`](https://github.com/vigzmv/react-promise-suspense)

### Tailwind

[PostCSS is currently not supported](https://github.com/preactjs/wmr/issues/250) which makes Tailwind usage impossible.

Fortunately [twind](https://twind.dev/) exists and includes an out of the box [WMR integration](https://twind.dev/usage-guides/wmr.html).

Unfortunately because we are using `preact/compat` we are [required](https://github.com/tw-in-js/use-twind-with/pull/21) to use `className` until a fix is found.

### Future improvements

- Use [Zod](https://zod.dev/) to validate data before sending to Pocketbase.
- Use [Stork](https://stork-search.net/) to create pre-compiled search index.
- Use [Ranger](https://github.com/TanStack/ranger) to handle volume/progress sliders.

### Gotcha's

If you are experiencing issues with React types update your `tsconfig.json` specifically `compilerOptions` to include the following:

```json
"paths": {
  "react": ["./node_modules/preact/compat/"],
  "react-dom": ["./node_modules/preact/compat/"]
}
```
