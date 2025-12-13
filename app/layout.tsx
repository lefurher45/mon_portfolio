// app/layout.tsx
import './globals.css';
import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        {/* Meta classiques pour WhatsApp, Messenger, Xharsap */}
        <title>Adolphe Pana | Cybersécurité & Réseaux</title>
        <meta name="description" content="Étudiant en cybersécurité à ESGIS, passionné par la sécurité réseau et le monitoring." />

        {/* Open Graph */}
        <meta property="og:title" content="Adolphe Pana | Cybersécurité & Réseaux" />
        <meta property="og:description" content="sécurité réseau, phishing simulation, monitoring avec Grafana." />
        <meta property="og:url" content="https://adolphe.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://adolphe.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="fr_FR" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Adolphe Pana | Cybersécurité" />
        <meta name="twitter:description" content="Étudiant en cybersécurité à ESGIS | Sécurité réseau | Monitoring | Ethical Hacking" />
        <meta name="twitter:image" content="https://adolphe.vercel.app/og-image.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
