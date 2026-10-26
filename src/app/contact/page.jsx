
import Image from "next/image";
import "./contact.css";

export const metadata = {
  title: "Contacter Florian Lobry | Conseiller immobilier iad",
  description:
    "Échangez avec Florian Lobry, conseiller immobilier iad sur le secteur de Wormhout et ses environs.",
};

export default function ContactPage() {
  return (
    <main className="contact-page">

      <section className="contact-hero">
        <div className="contact-hero-inner">
          <span className="contact-eyebrow">
            UN PROJET IMMOBILIER ?
          </span>

          <h1>Échangeons sur votre projet</h1>

          <p>
            Achat, vente ou estimation immobilière :
            bénéficiez d'un accompagnement personnalisé
            à chaque étape de votre projet.
          </p>
        </div>
      </section>

      <section className="contact-profile-section">
        <div className="contact-profile-card">

          <div className="contact-photo-area">
            <Image
              src="/uploads/florian.png"
              alt="Florian Lobry, conseiller immobilier iad"
              fill
              sizes="(max-width: 800px) 100vw, 450px"
              className="contact-agent-photo"
              priority
            />

            <div className="contact-photo-caption">
              Votre projet, mon engagement.
            </div>
          </div>

          <div className="contact-profile-info">

            <div className="contact-iad-brand">
              <Image
                src="/uploads/IAD.png"
                alt="Logo iad"
                width={110}
                height={70}
                className="contact-iad-logo"
              />
            </div>

            <span className="contact-profile-label">
              CONSEILLER IMMOBILIER INDÉPENDANT
            </span>

            <h2>Florian Lobry</h2>

            <div className="contact-divider"></div>

            <p className="contact-introduction">
              Vous avez un projet immobilier ?
              Je suis à votre écoute pour vous
              conseiller, vous accompagner et vous
              aider à le concrétiser dans les
              meilleures conditions.
            </p>

            <div className="contact-area">
              <span className="contact-area-icon">⌖</span>
              <div>
                <strong>Votre conseiller de proximité</strong>
                <span>Wormhout et ses alentours</span>
              </div>
            </div>

            <div className="contact-phone-block">
              <span>CONTACT DIRECT</span>

              <a
                href="tel:+33621640470"
                className="contact-phone-number"
              >
                06 21 64 04 70
              </a>
            </div>

            <a
              href="tel:+33621640470"
              className="contact-main-button"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.19 18a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.09 3.18 2 2 0 0 1 4.08 1h3a2 2 0 0 1 2 1.72c.13.96.36 1.91.69 2.81a2 2 0 0 1-.45 2.11L8.05 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.33 1.85.56 2.81.69A2 2 0 0 1 22 16.92z" />
              </svg>

              Contacter Florian
            </a>

            <p className="contact-signature">
              Proximité. Écoute. Confiance.
            </p>
          </div>
        </div>
      </section>

      <section className="contact-bottom-section">
        <div className="contact-bottom-inner">
          <span>FLORIAN LOBRY • IAD</span>
          <h2>Votre projet mérite toute mon attention.</h2>
          <p>
            Chaque projet immobilier est unique.
            Prenons le temps d'en discuter.
          </p>
        </div>
      </section>

    </main>
  );
}
