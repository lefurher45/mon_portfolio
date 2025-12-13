import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Adolphe Pana | Cybersécurité & Réseaux",
  description:
    "Étudiant en sécurité informatique à ESGIS, passionné par la cybersécurité, le monitoring (Grafana) et la sécurité des systèmes et réseaux.",

  openGraph: {
    title: "Adolphe Pana | Cybersécurité & Réseaux",
    description:
      "Portfolio d’un étudiant en cybersécurité : sécurité réseau, phishing simulation, monitoring avec Grafana.",
    url: "https://adolphe.vercel.app",
    siteName: "Adolphe Portfolio",
    images: [
      {
        url: "https://adolphe.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Adolphe Pana - Cybersécurité",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Adolphe Pana | Cybersécurité",
    description:
      "Étudiant en cybersécurité à ESGIS | Sécurité réseau | Monitoring | Ethical Hacking",
    images: ["https://adolphe.vercel.app/og-image.png"],
  },
};
