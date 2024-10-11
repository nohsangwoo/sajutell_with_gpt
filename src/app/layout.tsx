import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from 'next/script'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "사주팔자 | 무료 사주풀이 및 운세 분석",
  description: "전문가의 정확한 사주팔자 풀이로 당신의 운명을 알아보세요. 무료 사주 상담, 궁합, 토정비결, 운세 등 다양한 서비스 제공.",
  keywords: [
    "사주팔자, 무료 사주풀이, 운세, 사주상담",
    "사주팔자 무료보기, 사주 해석, 사주 분석",
    "토정비결, 사주 궁합, 사주 운세, 사주 운명",
    "오늘의 운세, 주간 운세, 월간 운세, 연간 운세",
    "사주팔자 상담, 사주 전문가, 사주 운세 앱",
    "생년월일 운세, 사주 명리학, 사주 운세 분석",
    "사주 운세 2024, 사주 운세 2025, 사주 운세 2026, 자평명리학, 사주 운세 무료",
    "사주 운세 정확도, 사주 운세 추천, 사주 운세 비교"
  ].join(", "),
  openGraph: {
    title: "사주팔자 - 당신의 운명을 밝혀주는 무료 사주풀이",
    description: "전문가의 정확한 사주팔자 해석으로 당신의 과거, 현재, 미래를 알아보세요. 무료 사주상담 및 다양한 운세 서비스 제공.",
    images: [
      {
        url: "https://sajutell.ludgi.ai/logo.png",
        width: 1200,
        height: 630,
        alt: "사주팔자 앱 인터페이스",
      },
    ],
    locale: "ko_KR",
    type: "website",
    siteName: "사주팔자",
  },
  twitter: {
    card: "summary_large_image",
    title: "사주팔자 - 무료 사주풀이 및 운세 분석",
    description: "당신의 운명을 알고 싶으신가요? 전문가의 정확한 사주팔자 풀이로 인생의 길을 밝혀보세요. 무료 상담 가능!",
    images: ["https://sajutell.ludgi.ai/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const pubId = "ca-pub-5823741955283998"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content={pubId} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pubId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Google Funding Choices 스크립트 */}
        <Script
          id="google-funding-choices"
          strategy="afterInteractive"
          src={`https://fundingchoicesmessages.google.com/i/${pubId}?ers=1`}
        />
        {/* Google FC Present 스크립트 */}
        <Script
          id="google-fc-present"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function() {function signalGooglefcPresent() {if (!window.frames['googlefcPresent']) {if (document.body) {const iframe = document.createElement('iframe'); iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;'; iframe.style.display = 'none'; iframe.name = 'googlefcPresent'; document.body.appendChild(iframe);} else {setTimeout(signalGooglefcPresent, 0);}}}signalGooglefcPresent();})();`
          }}
        />
      </body>
    </html>
  );
}
