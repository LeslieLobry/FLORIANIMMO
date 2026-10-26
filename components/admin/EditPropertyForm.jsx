
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const orientations = [
  { value: "NORD", label: "Nord" },
  { value: "SUD", label: "Sud" },
  { value: "EST", label: "Est" },
  { value: "OUEST", label: "Ouest" },
  { value: "NORD_EST", label: "Nord-Est" },
  { value: "NORD_OUEST", label: "Nord-Ouest" },
  { value: "SUD_EST", label: "Sud-Est" },
  { value: "SUD_OUEST", label: "Sud-Ouest" },
];

function normalizeOrientation(value) {
  if (!value) return "";

  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}

export default function EditPropertyForm({ property }) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: property.title ?? "",
    type: property.type ?? "MAISON",
    transaction: property.transaction ?? "VENTE",
    price: property.price ?? "",
    city: property.city ?? "",
    postalCode: property.postalCode ?? "",

    // SURFACES ET ORIENTATION
    surface: property.surface ?? "",
    landSurface: property.landSurface ?? "",
    orientation: normalizeOrientation(property.orientation),

    rooms: property.rooms ?? "",
    bedrooms: property.bedrooms ?? "",
    bathrooms: property.bathrooms ?? "",
    shortDesc: property.shortDesc ?? "",
    description: property.description ?? "",
    dpe: property.dpe ?? "",
    ges: property.ges ?? "",

    featured: Boolean(property.featured),
    published: Boolean(property.published),
    hasGarden: Boolean(property.hasGarden),
    hasGarage: Boolean(property.hasGarage),
    hasTerrace: Boolean(property.hasTerrace),
    hasElevator: Boolean(property.hasElevator),
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/admin/biens/${property.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data.message ||
          data.error ||
          "Erreur lors de la modification."
        );
      }

      router.push("/admin/biens");
      router.refresh();
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      className="admin-form premium-form"
      onSubmit={handleSubmit}
    >
      {/* INFORMATIONS PRINCIPALES */}

      <div className="premium-section">
        <div className="premium-section-head">
          <div>
            <p className="premium-kicker">
              Informations principales
            </p>
            <h2>Détails du bien</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <Field
            label="Titre"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <Field
            label="Ville"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
          />

          <Field
            label="Code postal"
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
          />

          <Field
            label="Prix (€)"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />

          <div className="admin-field">
            <label htmlFor="type">Type de bien</label>

            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="MAISON">Maison</option>
              <option value="APPARTEMENT">Appartement</option>
              <option value="IMMEUBLE">Immeuble</option>
              <option value="TERRAIN">Terrain</option>
              <option value="LOCAL">Local commercial</option>
              <option value="BUREAU">Bureau</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>

          <div className="admin-field">
            <label htmlFor="transaction">
              Type de transaction
            </label>

            <select
              id="transaction"
              name="transaction"
              value={form.transaction}
              onChange={handleChange}
            >
              <option value="VENTE">Vente</option>
              <option value="LOCATION">Location</option>
            </select>
          </div>
        </div>
      </div>

      {/* SURFACES ET ORIENTATION */}

      <div className="premium-section">
        <div className="premium-section-head">
          <div>
            <p className="premium-kicker">
              Caractéristiques
            </p>
            <h2>Surfaces et orientation</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <Field
            label="Surface habitable (m²)"
            name="surface"
            type="number"
            min="0"
            step="any"
            value={form.surface}
            onChange={handleChange}
            placeholder="Ex : 120"
          />

          <Field
            label="Surface du terrain (m²)"
            name="landSurface"
            type="number"
            min="0"
            step="any"
            value={form.landSurface}
            onChange={handleChange}
            placeholder="Ex : 650"
          />

          <div className="admin-field">
            <label htmlFor="orientation">
              Orientation du bien
            </label>

            <select
              id="orientation"
              name="orientation"
              value={form.orientation}
              onChange={handleChange}
            >
              <option value="">
                Non renseignée
              </option>

              {orientations.map((orientation) => (
                <option
                  key={orientation.value}
                  value={orientation.value}
                >
                  {orientation.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* PIÈCES ET DESCRIPTION */}

      <div className="premium-section">
        <div className="premium-section-head">
          <div>
            <p className="premium-kicker">
              Description
            </p>
            <h2>Composition du bien</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <Field
            label="Nombre de pièces"
            name="rooms"
            type="number"
            min="0"
            step="1"
            value={form.rooms}
            onChange={handleChange}
          />

          <Field
            label="Nombre de chambres"
            name="bedrooms"
            type="number"
            min="0"
            step="1"
            value={form.bedrooms}
            onChange={handleChange}
          />

          <Field
            label="Salles de bain"
            name="bathrooms"
            type="number"
            min="0"
            step="1"
            value={form.bathrooms}
            onChange={handleChange}
          />

          <div className="admin-field admin-field-full">
            <label htmlFor="shortDesc">
              Description courte
            </label>

            <input
              id="shortDesc"
              name="shortDesc"
              value={form.shortDesc}
              onChange={handleChange}
              placeholder="Résumé rapide du bien..."
            />
          </div>

          <div className="admin-field admin-field-full">
            <label htmlFor="description">
              Description complète
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={7}
              placeholder="Décrivez le bien en détail..."
            />
          </div>

          <Field
            label="DPE"
            name="dpe"
            value={form.dpe}
            onChange={handleChange}
          />

          <Field
            label="GES"
            name="ges"
            value={form.ges}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* PHOTOS ACTUELLES */}

      <div className="premium-section">
        <div className="premium-section-head">
          <div>
            <p className="premium-kicker">
              Photos actuelles
            </p>
            <h2>Images du bien</h2>
          </div>
        </div>

        {property.images?.length > 0 ? (
          <div className="premium-preview-grid">
            {property.images.map((image, index) => (
              <div
                className="premium-preview-card"
                key={image.id}
              >
                <div className="premium-preview-image-wrap">
                  <img
                    src={image.url}
                    alt={`Photo ${index + 1}`}
                    className="premium-preview-image"
                  />

                  {image.isPrimary && (
                    <div className="premium-primary-badge">
                      Image principale
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune photo enregistrée.</p>
        )}
      </div>

      {/* OPTIONS DU BIEN */}

      <div className="premium-section">
        <div className="premium-section-head">
          <div>
            <p className="premium-kicker">
              Réglages
            </p>
            <h2>Options du bien</h2>
          </div>
        </div>

        <div className="admin-options-grid">
          <Checkbox
            label="Publier le bien"
            name="published"
            checked={form.published}
            onChange={handleChange}
          />

          <Checkbox
            label="Mettre en avant"
            name="featured"
            checked={form.featured}
            onChange={handleChange}
          />

          <Checkbox
            label="Jardin"
            name="hasGarden"
            checked={form.hasGarden}
            onChange={handleChange}
          />

          <Checkbox
            label="Garage"
            name="hasGarage"
            checked={form.hasGarage}
            onChange={handleChange}
          />

          <Checkbox
            label="Terrasse"
            name="hasTerrace"
            checked={form.hasTerrace}
            onChange={handleChange}
          />

          <Checkbox
            label="Ascenseur"
            name="hasElevator"
            checked={form.hasElevator}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ERREURS ET ENREGISTREMENT */}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="premium-form-actions">
        <button
          type="submit"
          className="btn btn-gold premium-submit-btn"
          disabled={loading}
        >
          {loading
            ? "Modification..."
            : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}

// CHAMP RÉUTILISABLE

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  min,
  step,
}) {
  return (
    <div className="admin-field">
      <label htmlFor={name}>{label}</label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        step={step}
      />
    </div>
  );
}

// CASE À COCHER RÉUTILISABLE

function Checkbox({ label, name, checked, onChange }) {
  return (
    <div className="admin-option">
      <input
        id={name}
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />

      <label htmlFor={name}>
        <strong>{label}</strong>
      </label>
    </div>
  );
}
