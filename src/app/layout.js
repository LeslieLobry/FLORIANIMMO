
import "./globals.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Florian Immo",
  description:
    "Agence immobilière - achat, vente, estimation et rendez-vous",

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
