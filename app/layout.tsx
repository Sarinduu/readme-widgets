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
      className="h-full antialiased"
      style={{ "--font-geist-mono": "monospace" } as React.CSSProperties}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
