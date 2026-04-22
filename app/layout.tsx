import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Battery Now vs Wait for V2G",
  description: "A simple Australian household DER pathway comparison model.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
