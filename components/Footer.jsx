
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer fi-footer">
      <div className="container">

        <div className="fi-footer-main">

          {/* IDENTITÉ */}
          <div className="fi-footer-brand">
            <Link href="/" className="fi-footer-logo-link">
              <Image
                src="/uploads/IAD.png"
                alt="Logo iad immobilier"
                width={100}
                height={65}
                className="fi-footer-logo"
              />

              <div className="fi-footer-identity">
                <strong>Florian Lobry</strong>
                <span>Conseiller immobilier iad</span>
              </div>
            </Link>

            <p>
              Votre conseiller immobilier de proximité
              pour vous accompagner dans vos projets
              d'achat, de vente et d'estimation.
            </p>

            <Link
              href="/contact"
              className="fi-footer-contact-btn"
            >
              Parlons de votre projet
              <span aria-hidden="true"> →</span>
            </Link>
          </div>

          {/* NAVIGATION */}
          <div className="fi-footer-column">
            <h3>Navigation</h3>

            <ul>
              <li><Link href="/">Accueil</Link></li>
              <li><Link href="/biens">Nos biens</Link></li>
              <li><Link href="/rdv">Rendez-vous</Link></li>
              <li><Link href="/estimation">Estimation</Link></li>
              <li><Link href="/actualites">Actualités</Link></li>
              <li>
                <Link href="/ils-nous-font-confiance">
                  Ils nous font confiance
                </Link>
              </li>
            </ul>
          </div>

          {/* ACCOMPAGNEMENT */}
          <div className="fi-footer-column">
            <h3>Votre projet</h3>

            <ul>
              <li><Link href="/biens">Trouver un bien</Link></li>
              <li>
                <Link href="/estimation">
                  Estimer mon bien
                </Link>
              </li>
              <li>
                <Link href="/rdv">
                  Prendre rendez-vous
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  Contacter Florian
                </Link>
              </li>
            </ul>
          </div>

          {/* INFORMATIONS */}
          <div className="fi-footer-column">
            <h3>Informations</h3>

            <p className="fi-footer-location">
              <span aria-hidden="true">⌖</span>
              Wormhout (59470)
            </p>

            <p>
              Un accompagnement personnalisé
              pour concrétiser vos projets immobiliers.
            </p>

            <Link
              href="/contact"
              className="fi-footer-text-link"
            >
              Envoyer un message →
            </Link>
          </div>

        </div>

        {/* BAS DU FOOTER */}
        <div className="fi-footer-bottom">
          <p>
            © {currentYear} Florian Lobry — Conseiller immobilier iad.
          </p>

          <div className="fi-footer-legal">
            <Link href="/mentions-legales">
              Mentions légales
            </Link>

            <Link href="/confidentialite">
              Confidentialité
            </Link>
          </div>
        </div>

        <p className="fi-footer-disclaimer">
          Florian Lobry exerce en tant que conseiller immobilier
          indépendant au sein du réseau iad. Les informations
          réglementaires et professionnelles complètes sont
          disponibles dans les mentions légales.
        </p>

      </div>
    </footer>
  );
}
