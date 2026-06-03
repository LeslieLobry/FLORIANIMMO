import "./contact.css";

export const metadata = {
  title: "Contact | Florian Immo",
  description: "Contactez Florian Lobry pour votre projet immobilier.",
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <p className="contact-kicker">Contact</p>
          <h1>Parlons de votre projet immobilier</h1>
          <p>
            Achat, vente, estimation ou simple question : je vous accompagne
            avec sérieux et proximité dans votre projet.
          </p>
        </div>
      </section>

      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-info">
            <h2>Me contacter</h2>
            <p>
              Remplissez le formulaire ou contactez-moi directement. Je vous
              répondrai dans les meilleurs délais.
            </p>

            <div className="contact-card">
              <span>📞</span>
              <div>
                <h3>Téléphone</h3>
                <a href="tel:0621640470">06 21 64 04 70</a>
              </div>
            </div>

            <div className="contact-card">
              <span>✉️</span>
              <div>
                <h3>Email</h3>
                <a href="mailto:florian.lobry@iadfrance.fr">
                  florian.lobry@iadfrance.fr
                </a>
              </div>
            </div>

            <div className="contact-card">
              <span>📍</span>
              <div>
                <h3>Secteur</h3>
                <p>Wormhout et ses alentours</p>
              </div>
            </div>
          </div>

          <form className="contact-form">
            <h2>Envoyer un message</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Prénom</label>
                <input id="firstName" type="text" placeholder="Votre prénom" />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Nom</label>
                <input id="lastName" type="text" placeholder="Votre nom" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="votre@email.fr" />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input id="phone" type="tel" placeholder="06 00 00 00 00" />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Sujet</label>
              <select id="subject" defaultValue="">
                <option value="" disabled>
                  Choisir un sujet
                </option>
                <option>Je souhaite vendre un bien</option>
                <option>Je souhaite acheter un bien</option>
                <option>Je souhaite une estimation</option>
                <option>Autre demande</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                rows="6"
                placeholder="Décrivez votre projet..."
              />
            </div>

            <button type="submit">Envoyer ma demande</button>
          </form>
        </div>
      </section>
    </main>
  );
}