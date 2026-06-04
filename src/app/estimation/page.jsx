"use client";

import { useState } from "react";
import "./estimation.css";

export default function EstimationPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    adresse: "",
    ville: "",
    codePostal: "",
    typeBien: "Maison",
    surfaceHabitable: "",
    surfaceTerrain: "",
    nbPieces: "",
    chambres: "",
    anneeConstruction: "",
    dpe: "",
    etatBien: "",
    chauffage: "",
    informations: "",
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
const envoyerDemande = async () => {
  setLoading(true);
  setMessage(null);

  try {
    const res = await fetch("/api/estimation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Erreur lors de l'envoi.");
    }

    setMessage({
      type: "success",
      title: "Demande envoyée avec succès",
      text:
        "Votre demande a bien été transmise. Un email de confirmation vient de vous être envoyé.",
    });

    setFormData({
      adresse: "",
      ville: "",
      codePostal: "",
      typeBien: "Maison",
      surfaceHabitable: "",
      surfaceTerrain: "",
      nbPieces: "",
      chambres: "",
      anneeConstruction: "",
      dpe: "",
      etatBien: "",
      chauffage: "",
      informations: "",
      prenom: "",
      nom: "",
      email: "",
      telephone: "",
    });

    setStep(1);
  } catch (error) {
    console.error(error);

    setMessage({
      type: "error",
      title: "Erreur lors de l'envoi",
      text:
        "Votre demande n'a pas pu être envoyée. Merci de réessayer dans quelques instants.",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="estimation-page">
      <section className="estimation-header">
        <span>Estimation gratuite</span>
        <h1>Estimez votre bien immobilier</h1>
        <p>Obtenez une première estimation rapide et personnalisée.</p>
      </section>

      <section className="estimation-box">
        {message && (
  <div
    className={`form-message ${
      message.type === "success" ? "success" : "error"
    }`}
  >
    <div className="form-message-icon">
      {message.type === "success" ? "✓" : "⚠"}
    </div>

    <div>
      <strong>{message.title}</strong>
      <p>{message.text}</p>
    </div>
  </div>
)}

        <div className="steps-indicator">
          <div className={step >= 1 ? "active" : ""}>1</div>
          <div className={step >= 2 ? "active" : ""}>2</div>
          <div className={step >= 3 ? "active" : ""}>3</div>
        </div>

        {step === 1 && (
          <div className="form-step">
            <h2>Adresse du bien</h2>

            <label>Adresse complète *</label>
            <input
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              placeholder="Ex : 12 rue de Lille"
            />

            <label>Ville *</label>
            <input
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              placeholder="Ex : Tourcoing"
            />

            <label>Code postal *</label>
            <input
              name="codePostal"
              value={formData.codePostal}
              onChange={handleChange}
              placeholder="Ex : 59200"
            />

            <label>Type de bien *</label>
            <select
              name="typeBien"
              value={formData.typeBien}
              onChange={handleChange}
            >
              <option>Maison</option>
              <option>Appartement</option>
              <option>Terrain</option>
              <option>Immeuble</option>
            </select>

            <div className="form-actions right">
              <button onClick={() => setStep(2)} className="btn-next">
                Suivant ›
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h2>Caractéristiques du bien</h2>

            <div className="form-grid">
              <div>
                <label>Surface habitable (m²)</label>
                <input
                  name="surfaceHabitable"
                  value={formData.surfaceHabitable}
                  onChange={handleChange}
                  placeholder="85"
                />
              </div>

              <div>
                <label>Surface terrain (m²)</label>
                <input
                  name="surfaceTerrain"
                  value={formData.surfaceTerrain}
                  onChange={handleChange}
                  placeholder="500"
                />
              </div>

              <div>
                <label>Nombre de pièces</label>
                <input
                  name="nbPieces"
                  value={formData.nbPieces}
                  onChange={handleChange}
                  placeholder="4"
                />
              </div>

              <div>
                <label>Chambres</label>
                <input
                  name="chambres"
                  value={formData.chambres}
                  onChange={handleChange}
                  placeholder="3"
                />
              </div>

              <div>
                <label>Année de construction</label>
                <input
                  name="anneeConstruction"
                  value={formData.anneeConstruction}
                  onChange={handleChange}
                  placeholder="1980"
                />
              </div>

              <div>
                <label>DPE</label>
                <select name="dpe" value={formData.dpe} onChange={handleChange}>
                  <option value="">Classe énergétique</option>
                  <option>A</option>
                  <option>B</option>
                  <option>C</option>
                  <option>D</option>
                  <option>E</option>
                  <option>F</option>
                  <option>G</option>
                </select>
              </div>
            </div>

            <label>État général du bien</label>
            <select
              name="etatBien"
              value={formData.etatBien}
              onChange={handleChange}
              className="small-select"
            >
              <option value="">État du bien</option>
              <option>Excellent</option>
              <option>Bon</option>
              <option>À rafraîchir</option>
              <option>Travaux à prévoir</option>
            </select>

            <label>Type de chauffage</label>
            <input
              name="chauffage"
              value={formData.chauffage}
              onChange={handleChange}
              placeholder="Ex : Fioul, Gaz, Pompe à chaleur..."
            />

            <label>Informations complémentaires</label>
            <textarea
              name="informations"
              value={formData.informations}
              onChange={handleChange}
              placeholder="Décrivez les atouts de votre bien, travaux récents, équipements particuliers..."
            />

            <div className="form-actions">
              <button onClick={() => setStep(1)} className="btn-prev">
                ‹ Précédent
              </button>
              <button onClick={() => setStep(3)} className="btn-next">
                Suivant ›
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h2>Vos coordonnées</h2>
            <p className="form-intro">
              Le rapport d'estimation sera envoyé à Florian Lobry qui vous
              contactera pour affiner l'évaluation.
            </p>

            <div className="form-grid">
              <div>
                <label>Prénom *</label>
                <input
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder="Jean"
                />
              </div>

              <div>
                <label>Nom *</label>
                <input
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder="Dupont"
                />
              </div>
            </div>

            <label>Email *</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jean.dupont@email.com"
            />

            <label>Téléphone *</label>
            <input
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="06 12 34 56 78"
            />

            <div className="info-box">
              <strong>Ce qui va se passer :</strong>
              <p>✓ Votre demande est transmise à Florian Lobry</p>
              <p>✓ Une estimation basée sur le marché local est calculée</p>
              <p>
                ✓ Florian vous contacte pour une visite gratuite et une
                estimation précise
              </p>
            </div>

            <div className="form-actions">
              <button onClick={() => setStep(2)} className="btn-prev">
                ‹ Précédent
              </button>

              <button
                type="button"
                className="btn-submit"
                onClick={envoyerDemande}
                disabled={loading}
              >
                {loading ? "Envoi en cours..." : "▦ Obtenir mon estimation"}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}