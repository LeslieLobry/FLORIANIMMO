"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditPropertyForm({ property }) {
  const router = useRouter();

  const [form, setForm] = useState({
    title: property.title || "",
    type: property.type || "MAISON",
    transaction: property.transaction || "VENTE",
    price: property.price || "",
    city: property.city || "",
    postalCode: property.postalCode || "",
    surface: property.surface || "",
    rooms: property.rooms || "",
    bedrooms: property.bedrooms || "",
    bathrooms: property.bathrooms || "",
    shortDesc: property.shortDesc || "",
    description: property.description || "",
    dpe: property.dpe || "",
    ges: property.ges || "",
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
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/biens/${property.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la modification.");
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
    <form className="admin-form premium-form" onSubmit={handleSubmit}>
      <div className="premium-section">
        <div className="premium-section-head">
          <div>
            <p className="premium-kicker">Informations principales</p>
            <h2>Détails du bien</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <Field label="Titre" name="title" value={form.title} onChange={handleChange} required />
          <Field label="Ville" name="city" value={form.city} onChange={handleChange} required />
          <Field label="Code postal" name="postalCode" value={form.postalCode} onChange={handleChange} />
          <Field label="Prix" name="price" type="number" value={form.price} onChange={handleChange} required />

          <div className="admin-field">
            <label>Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="MAISON">Maison</option>
              <option value="APPARTEMENT">Appartement</option>
              <option value="IMMEUBLE">Immeuble</option>
              <option value="TERRAIN">Terrain</option>
              <option value="LOCAL">Local</option>
              <option value="BUREAU">Bureau</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>

          <div className="admin-field">
            <label>Transaction</label>
            <select name="transaction" value={form.transaction} onChange={handleChange}>
              <option value="VENTE">Vente</option>
              <option value="LOCATION">Location</option>
            </select>
          </div>

          <Field label="Surface (m²)" name="surface" type="number" value={form.surface} onChange={handleChange} />
          <Field label="Pièces" name="rooms" type="number" value={form.rooms} onChange={handleChange} />
          <Field label="Chambres" name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} />
          <Field label="Salles de bain" name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} />

          <div className="admin-field admin-field-full">
            <label>Description courte</label>
            <input
              name="shortDesc"
              value={form.shortDesc}
              onChange={handleChange}
            />
          </div>

          <div className="admin-field admin-field-full">
            <label>Description complète</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={7}
            />
          </div>

          <Field label="DPE" name="dpe" value={form.dpe} onChange={handleChange} />
          <Field label="GES" name="ges" value={form.ges} onChange={handleChange} />
        </div>
      </div>

      <div className="premium-section">
        <div className="premium-section-head">
          <div>
            <p className="premium-kicker">Photos actuelles</p>
            <h2>Images du bien</h2>
          </div>
        </div>

        {property.images?.length > 0 ? (
          <div className="premium-preview-grid">
            {property.images.map((image, index) => (
              <div className="premium-preview-card" key={image.id}>
                <div className="premium-preview-image-wrap">
                  <img
                    src={image.url}
                    alt={`Photo ${index + 1}`}
                    className="premium-preview-image"
                  />

                  {index === 0 ? (
                    <div className="premium-primary-badge">Image principale</div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Aucune photo enregistrée.</p>
        )}
      </div>

      <div className="premium-section">
        <div className="premium-section-head">
          <div>
            <p className="premium-kicker">Réglages</p>
            <h2>Options du bien</h2>
          </div>
        </div>

        <div className="admin-options-grid">
          <Checkbox label="Publier le bien" name="published" checked={form.published} onChange={handleChange} />
          <Checkbox label="Mettre en avant" name="featured" checked={form.featured} onChange={handleChange} />
          <Checkbox label="Jardin" name="hasGarden" checked={form.hasGarden} onChange={handleChange} />
          <Checkbox label="Garage" name="hasGarage" checked={form.hasGarage} onChange={handleChange} />
          <Checkbox label="Terrasse" name="hasTerrace" checked={form.hasTerrace} onChange={handleChange} />
          <Checkbox label="Ascenseur" name="hasElevator" checked={form.hasElevator} onChange={handleChange} />
        </div>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="premium-form-actions">
        <button type="submit" className="btn btn-gold premium-submit-btn" disabled={loading}>
          {loading ? "Modification..." : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, name, type = "text", value, onChange, required = false }) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
}

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