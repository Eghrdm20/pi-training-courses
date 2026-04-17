import "./globals.css"
import type { Metadata } from "next"
import type { ReactNode } from "react"
import Script from "next/script"

export const metadata: Metadata = {
  title: "pi-training-courses",
  description: "Pi Training Courses",
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
        <Script
          src="https://sdk.minepi.com/pi-sdk.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
