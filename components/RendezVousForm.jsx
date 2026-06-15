"use client";

import { useState } from "react";

export default function RendezVousForm() {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    dateSouhaitee: "",
    heureSouhaitee: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const res = await fetch("/api/rendez-vous", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de l’envoi.");
      }

      setSuccess("Votre demande de rendez-vous a bien été envoyée.");
      setForm({
        nom: "",
        email: "",
        telephone: "",
        sujet: "",
        dateSouhaitee: "",
        heureSouhaitee: "",
        message: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      {success && <p className="form-success">{success}</p>}
      {error && <p className="form-error">{error}</p>}

      <div className="form-grid">
        <div className="form-group">
          <label>Nom complet *</label>
          <input
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Téléphone</label>
          <input
            type="tel"
            name="telephone"
            value={form.telephone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Date souhaitée</label>
         <input
  type="date"
  name="dateSouhaitee"
  value={form.dateSouhaitee}
  onChange={(e) => {
    const date = new Date(e.target.value);
    const day = date.getDay();

    if (day === 0) {
      alert("L'agence est fermée le dimanche.");
      return;
    }

    handleChange(e);
  }}
/>
        </div>

        <div className="form-group">
          <label>Heure souhaitée</label>
          <input
            type="time"
            name="heureSouhaitee"
            value={form.heureSouhaitee}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Sujet</label>
          <select name="sujet" value={form.sujet} onChange={handleChange}>
            <option value="">Choisir un sujet</option>
            <option value="Estimation">Estimation d’un bien</option>
            <option value="Vente">Vente d’un bien</option>
            <option value="Achat">Achat d’un bien</option>
            <option value="Autre">Autre demande</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Message</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows="6"
          placeholder="Expliquez rapidement votre projet..."
        />
      </div>

      <button className="btn btn-gold" type="submit" disabled={loading}>
        {loading ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}