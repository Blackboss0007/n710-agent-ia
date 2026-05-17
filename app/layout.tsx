import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "N710 AI Sales Agent",
  description: "Vendedor digital com IA para WhatsApp, follow-up e vendas 24h."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body>{children}</body>
    </html>
  );
}
