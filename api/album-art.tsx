import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'experimental-edge',
}

const fetchFont = (path: string) => fetch(
  new URL(
    path,
    import.meta.url,
  ),
).then((res) => res.arrayBuffer())

const karlaBoldFont = fetchFont('../public/fonts/Karla-Bold.tff');
const karlaRegularFont = fetchFont('../public/fonts/Karla-Regular.tff');
const inconsolataBoldFont = fetchFont('../public/fonts/Inconsolata-Bold.tff');
const inconsolataRegularFont = fetchFont('../public/fonts/Inconsolata-Regular.tff');


export default async function handler(req: Request) {
  const [
    karlaBoldFontData,
    karlaRegularFontData,
    inconsolataBoldFontData,
    inconsolataRegularFontData
  ] = await Promise.all([
    karlaBoldFont,
    karlaRegularFont,
    inconsolataBoldFont,
    inconsolataRegularFont
  ]);

  try {
    const { searchParams } = new URL(req.url)

    const title = searchParams.get('title') ?? 'My Default Title';

    return new ImageResponse(
      (
        <div
          tw="flex w-full items-center h-full justify-between"
        >
          <p
            tw="text-6xl leading-tight my-0"
            style={{
              fontFamily: 'Inconsolata',
            }}
          >
            {title}
          </p>
        </div>
      ),
      {
        width: 3000,
        height: 3000,
        fonts: [
          {
            name: 'Karla',
            data: karlaBoldFontData,
            style: 'normal',
            weight: 700
          },
          {
            name: 'Karla',
            data: karlaRegularFontData,
            style: 'normal',
            weight: 400
          },
          {
            name: 'Inconsolata',
            data: inconsolataBoldFontData,
            style: 'normal',
            weight: 700
          },
          {
            name: 'Inconsolata',
            data: inconsolataRegularFontData,
            style: 'normal',
            weight: 400
          },
        ],
      },
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}