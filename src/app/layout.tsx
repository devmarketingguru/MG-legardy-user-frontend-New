import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Legardy Referral Portal",
  description:
    "ระบบสำหรับผู้แนะนำของ Legardy ใช้สร้างลิ้งเชิญเพื่อนและติดตามสถิติคอมมิชชั่น",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={notoSansThai.variable}>
      <body className="font-sans antialiased bg-slate-100 text-slate-900">
        {children}
      </body>
    </html>
  );
}
