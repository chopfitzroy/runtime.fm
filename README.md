### Pre-rendering

We make extensive use of pre-rendering. To do this effectively we use `use-fetch` to fetch data in a [suspense friendly](https://github.com/preactjs/wmr/tree/main/packages/preact-iso#prerenderjs) way.

A number of hooks were evaluated before deciding on `use-fetch` below are some of the other options considered:

- [`vigzmv/react-promise-suspense`](https://github.com/vigzmv/react-promise-suspense)
- [`CharlesStover/fetch-suspense`](https://github.com/CharlesStover/fetch-suspense)
- [`dai-shi/react-suspense-fetch`](https://github.com/dai-shi/react-suspense-fetch)
- [`dai-shi/react-hooks-fetch`](https://github.com/dai-shi/react-hooks-fetch)
- [`pmndrs/use-asset`](https://github.com/pmndrs/use-asset)

There was even a period where we [rolled our own](https://github.com/preactjs/wmr/discussions/950).

### Tailwind

[PostCSS is currently not supported](https://github.com/preactjs/wmr/issues/250) which makes Tailwind usage impossible.

Fortunately [twind](https://twind.dev/) exists and includes an out of the box [WMR integration](https://twind.dev/usage-guides/wmr.html).

Unfortunately because we are using `preact/compat` we are [required](https://github.com/tw-in-js/use-twind-with/pull/21) to use `className` until a fix is found.
