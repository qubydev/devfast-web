import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"]
})

export const metadata: Metadata = {
  title: "devfast",
  description: "Fastest way to setup your new project.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jetbrainsMono.className} antialiased`}
      >
        <div className="pt-14">
          <Navbar />
          {children}
          <Toaster
            position="bottom-right"
            reverseOrder={false}
          />
        </div>
      </body>
    </html>
  );
}
