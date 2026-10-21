import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Civic Solver — Figure out who can help",
  description:
    "Describe your problem. We'll figure out who's responsible and what to do next.",
  keywords: ["civic", "local government", "report issue", "community"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
