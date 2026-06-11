import Hero from "../../components/Hero";
import FeaturedProperties from "../../components/FeaturedProperties";
import Services from "../../components/Services";
import ContactCta from "../../components/ContactCta";

export const metadata = {
  title: "Florian Immo | Estimation et vente immobilière",
  description:
    "Florian Immo vous accompagne dans l’estimation, la vente et la mise en valeur de votre bien immobilier.",
};

export default function HomePage() {
  return (
    <>
      <Hero />

      <FeaturedProperties />
      {/* <section className="home-intro">
        <div className="container">
          <span className="eyebrow">Agence immobilière indépendante</span>

          <h1>
            Vendez votre bien avec un accompagnement humain, local et efficace.
          </h1>

          <p>
            Florian Immo vous accompagne à chaque étape : estimation, mise en
            valeur, diffusion, visites et suivi jusqu’à la vente.
          </p>

          <div className="home-intro-actions">
            <a href="/estimation" className="btn btn-gold">
              Faire estimer mon bien
            </a>

            <a href="/biens" className="btn btn-outline">
              Voir les biens
            </a>
          </div>
        </div>
      </section> */}

{/* 
      <Services /> */}
<section className="why-section">
  <div className="container">
    <div className="why-header">
      <span>Pourquoi choisir Florian Lobry ?</span>

      <h2>
        Mandataire IAD, je combine l'expertise d'un grand réseau avec la proximité
        d'un professionnel local.
      </h2>
    </div>

    <div className="why-grid">
      <div className="why-card">
        <div className="why-icon">📍</div>

        <h3>Expert local</h3>

        <p>
          Je vis et travaille dans les Flandres. Je connais parfaitement le
          marché immobilier local, les quartiers et les prix pratiqués.
        </p>
      </div>

      <div className="why-card">
        <div className="why-icon">🛡️</div>

        <h3>Réseau IAD</h3>

        <p>
          Bénéficiez de la puissance du premier réseau de mandataires en France
          et d'une diffusion nationale de votre bien.
        </p>
      </div>

      <div className="why-card">
        <div className="why-icon">⏱️</div>

        <h3>Disponible et réactif</h3>

        <p>
          Je m'engage à répondre rapidement à toutes vos demandes et à vous
          accompagner personnellement à chaque étape de votre projet.
        </p>
      </div>
    </div>
  </div>
</section>
    </>
  );
}