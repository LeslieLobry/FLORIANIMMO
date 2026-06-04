"use client";

import "./contact.css";

export default function ContactPage() {
  async function handleSubmit(e) {
    e.preventDefault();

    const form = e.currentTarget;

    const data = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      phone: form.phone.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Erreur lors de l'envoi.");
        return;
      }

      alert("Votre message a bien été envoyé.");
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'envoi du message.");
    }
  }

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

          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Envoyer un message</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Prénom</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Votre prénom"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Nom</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="votre@email.fr"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Téléphone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="06 00 00 00 00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Sujet</label>
              <select id="subject" name="subject" defaultValue="">
                <option value="" disabled>
                  Choisir un sujet
                </option>
                <option value="Je souhaite vendre un bien">
                  Je souhaite vendre un bien
                </option>
                <option value="Je souhaite acheter un bien">
                  Je souhaite acheter un bien
                </option>
                <option value="Je souhaite une estimation">
                  Je souhaite une estimation
                </option>
                <option value="Autre demande">Autre demande</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="Décrivez votre projet..."
                required
              />
            </div>

            <button type="submit">Envoyer ma demande</button>
          </form>
        </div>
      </section>
    </main>
  );
}