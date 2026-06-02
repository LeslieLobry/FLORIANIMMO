import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="eyebrow">Agence immobilière</span>
          <h1>Trouvez le bien idéal avec un accompagnement sérieux et humain</h1>
          <p>
            Achat, vente, estimation et rendez-vous en ligne. Un site moderne
            pour présenter les biens et simplifier la prise de contact.
          </p>

          <div className="hero-actions">
            <Link href="/biens" className="btn btn-gold">
              Voir les biens
            </Link>
            <Link href="/estimation" className="btn btn-outline">
              Demander une estimation
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-card">
            <p className="hero-card-label">Bien à la une</p>
            <h3>Maison contemporaine</h3>
            <p>Roubaix • 265 000 €</p>
          </div>
        </div>
      </div>
    </section>
  );
}