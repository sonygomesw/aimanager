import type { Metadata } from "next";
import "./globals.css";
import { CheckInProvider } from "@/lib/CheckInProvider";

export const metadata: Metadata = {
  title: "AI Manager - AI Assistant for Artists",
  description: "Your AI assistant to organize, manage your artistic projects and develop your career",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-gray-900">
        <CheckInProvider>
          {children}
        </CheckInProvider>
      </body>
    </html>
  );
}
