import { Head, Html, Main, NextScript } from "next/document"

const appleTouchIconSizes = [48, 72, 96, 144, 192, 256, 384, 512]

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="theme-color" content="#23ffb2" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.webmanifest" crossOrigin="anonymous" />
        {appleTouchIconSizes.map((size) => (
          <link key={size} rel="apple-touch-icon" sizes={`${size}x${size}`} href={`/icons/icon-${size}x${size}.png`} />
        ))}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
