import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <h3>Florian Immo</h3>
          <p>
            Agence immobilière spécialisée dans l'achat, la vente et
            l'accompagnement sur mesure.
          </p>
        </div>

        <div>
          <h4>Navigation</h4>
          <ul>
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/biens">Biens</Link></li>
            <li><Link href="/acheter">Acheter</Link></li>
            <li><Link href="/vendre">Vendre</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4>Légal</h4>
          <ul>
            <li><Link href="/mentions-legales">Mentions légales</Link></li>
            <li><Link href="/confidentialite">Confidentialité</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}