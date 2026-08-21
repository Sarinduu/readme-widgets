import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sarindu's README Kit",
  description: "The personal SVG widget toolkit behind Sarindu's GitHub profile.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      style={{ "--font-geist-mono": "monospace" } as React.CSSProperties}
    >
      <body>{children}</body>
    </html>
  );
}
