"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const initialState = {
  title: "",
  type: "MAISON",
  transaction: "VENTE",
  price: "",
  city: "",
  postalCode: "",
  surface: "",
  rooms: "",
  bedrooms: "",
  bathrooms: "",
  shortDesc: "",
  description: "",
  dpe: "",
  ges: "",
  featured: false,
  published: false,
  hasGarden: false,
  hasGarage: false,
  hasTerrace: false,
  hasElevator: false,
};

export default function PropertyForm() {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleFilesChange(e) {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      files.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch("/api/admin/biens", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la création du bien.");
      }

      setSuccess("Bien créé avec succès.");
      setForm(initialState);
      setFiles([]);
      router.push("/admin/biens");
      router.refresh();
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-form-grid">
        <div className="admin-field">
          <label>Titre</label>
          <input name="title" value={form.title} onChange={handleChange} required />
        </div>

        <div className="admin-field">
          <label>Ville</label>
          <input name="city" value={form.city} onChange={handleChange} required />
        </div>

        <div className="admin-field">
          <label>Code postal</label>
          <input name="postalCode" value={form.postalCode} onChange={handleChange} />
        </div>

        <div className="admin-field">
          <label>Prix</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} required />
        </div>

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

        <div className="admin-field">
          <label>Surface (m²)</label>
          <input name="surface" type="number" value={form.surface} onChange={handleChange} />
        </div>

        <div className="admin-field">
          <label>Pièces</label>
          <input name="rooms" type="number" value={form.rooms} onChange={handleChange} />
        </div>

        <div className="admin-field">
          <label>Chambres</label>
          <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} />
        </div>

        <div className="admin-field">
          <label>Salles de bain</label>
          <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} />
        </div>

        <div className="admin-field admin-field-full">
          <label>Description courte</label>
          <input name="shortDesc" value={form.shortDesc} onChange={handleChange} />
        </div>

        <div className="admin-field admin-field-full">
          <label>Description complète</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
          />
        </div>

        <div className="admin-field">
          <label>DPE</label>
          <input name="dpe" value={form.dpe} onChange={handleChange} />
        </div>

        <div className="admin-field">
          <label>GES</label>
          <input name="ges" value={form.ges} onChange={handleChange} />
        </div>

        <div className="admin-field admin-field-full">
          <label>Photos du bien</label>
          <input type="file" accept="image/*" multiple onChange={handleFilesChange} />
          {files.length > 0 ? (
            <p className="upload-note">{files.length} photo(s) sélectionnée(s)</p>
          ) : null}
        </div>
      </div>

      <div className="admin-checkbox-grid">
        <label><input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Mettre en avant</label>
        <label><input type="checkbox" name="published" checked={form.published} onChange={handleChange} /> Publier</label>
        <label><input type="checkbox" name="hasGarden" checked={form.hasGarden} onChange={handleChange} /> Jardin</label>
        <label><input type="checkbox" name="hasGarage" checked={form.hasGarage} onChange={handleChange} /> Garage</label>
        <label><input type="checkbox" name="hasTerrace" checked={form.hasTerrace} onChange={handleChange} /> Terrasse</label>
        <label><input type="checkbox" name="hasElevator" checked={form.hasElevator} onChange={handleChange} /> Ascenseur</label>
      </div>

      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}

      <button type="submit" className="btn btn-gold" disabled={loading}>
        {loading ? "Enregistrement..." : "Créer le bien"}
      </button>
    </form>
  );
}