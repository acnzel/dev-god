import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "개발의신 - AI 소프트웨어 개발 어시스턴트",
  description: "Gemini API를 활용한 소프트웨어 개발 전문 AI 챗봇",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
