import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'
import React from "react";

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
      <Main />
      <NextScript />
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBMePTwqFO2xPCaxUYqq0Vq4JQc631jo0o&libraries=places"
        strategy="beforeInteractive"
      ></Script>
      </body>
    </Html>
  )
}