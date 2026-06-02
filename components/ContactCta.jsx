import Link from "next/link";

export default function ContactCta() {
  return (
    <section className="contact-cta">
      <div className="container contact-cta-inner">
        <div>
          <span className="eyebrow">Projet immobilier</span>
          <h2>Parlons de votre besoin</h2>
          <p>
            Vous souhaitez vendre, acheter ou planifier un rendez-vous ? On met
            en place un parcours simple et rapide.
          </p>
        </div>

        <Link href="/contact" className="btn btn-gold">
          Nous contacter
        </Link>
      </div>
    </section>
  );
}