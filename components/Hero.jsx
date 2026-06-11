import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <span className="eyebrow">Conseiller immobilier indépendant</span>

          <h1>
            Un accompagnement immobilier humain, sérieux et personnalisé.
          </h1>

          <p>
            Florian vous accompagne dans votre projet immobilier, de
            l’estimation à la signature, avec une approche locale, transparente
            et professionnelle.
          </p>

          <div className="hero-actions">
            <Link href="/estimation" className="btn btn-gold">
              Faire estimer mon bien
            </Link>

            <Link href="/biens" className="btn btn-outline">
              Voir les biens disponibles
            </Link>
          </div>

          <div className="hero-reassurance">
            <span>Estimation offerte</span>
            <span>Suivi personnalisé</span>
            <span>Marché local</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="agent-card">
            <div className="agent-image-wrap">
              <Image
                src="/uploads/florian.webp"
                alt="Florian, conseiller immobilier"
                width={420}
                height={520}
                priority
                className="agent-image"
              />
            </div>

            <div className="agent-info">
              <span className="agent-label">Votre conseiller</span>
              <h2>Florian</h2>
              <p>Conseiller immobilier indépendant</p>

              <div className="agent-contact">
                <Link href="/rendez-vous" className="btn btn-gold btn-full">
                  Prendre rendez-vous
                </Link>

                <Link href="/contact" className="agent-phone">
                  Me contacter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}