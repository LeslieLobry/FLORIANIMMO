"use client";

import { useEffect, useMemo, useState } from "react";
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

    if (selectedFiles.length === 0) return;

    setFiles((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  }

  function removeFile(indexToRemove) {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
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

  const previewItems = useMemo(() => {
    return files.map((file) => ({
      file,
      name: file.name,
      size: formatFileSize(file.size),
      url: URL.createObjectURL(file),
    }));
  }, [files]);

  useEffect(() => {
    return () => {
      previewItems.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewItems]);

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
          <div className="admin-field">
            <label htmlFor="title">Titre</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex : Maison familiale avec jardin"
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="city">Ville</label>
            <input
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Ex : Tourcoing"
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="postalCode">Code postal</label>
            <input
              id="postalCode"
              name="postalCode"
              value={form.postalCode}
              onChange={handleChange}
              placeholder="Ex : 59200"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="price">Prix</label>
            <input
              id="price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Ex : 245000"
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="type">Type</label>
            <select id="type" name="type" value={form.type} onChange={handleChange}>
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
            <label htmlFor="transaction">Transaction</label>
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

          <div className="admin-field">
            <label htmlFor="surface">Surface (m²)</label>
            <input
              id="surface"
              name="surface"
              type="number"
              value={form.surface}
              onChange={handleChange}
              placeholder="Ex : 120"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="rooms">Pièces</label>
            <input
              id="rooms"
              name="rooms"
              type="number"
              value={form.rooms}
              onChange={handleChange}
              placeholder="Ex : 5"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="bedrooms">Chambres</label>
            <input
              id="bedrooms"
              name="bedrooms"
              type="number"
              value={form.bedrooms}
              onChange={handleChange}
              placeholder="Ex : 3"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="bathrooms">Salles de bain</label>
            <input
              id="bathrooms"
              name="bathrooms"
              type="number"
              value={form.bathrooms}
              onChange={handleChange}
              placeholder="Ex : 2"
            />
          </div>

          <div className="admin-field admin-field-full">
            <label htmlFor="shortDesc">Description courte</label>
            <input
              id="shortDesc"
              name="shortDesc"
              value={form.shortDesc}
              onChange={handleChange}
              placeholder="Résumé rapide du bien"
            />
          </div>

          <div className="admin-field admin-field-full">
            <label htmlFor="description">Description complète</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={7}
              placeholder="Décris le bien en détail..."
            />
          </div>

          <div className="admin-field">
            <label htmlFor="dpe">DPE</label>
            <input
              id="dpe"
              name="dpe"
              value={form.dpe}
              onChange={handleChange}
              placeholder="Ex : C"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="ges">GES</label>
            <input
              id="ges"
              name="ges"
              value={form.ges}
              onChange={handleChange}
              placeholder="Ex : A"
            />
          </div>
        </div>
      </div>

      <div className="premium-section">
        <div className="premium-section-head premium-section-head-stack">
          <div>
            <p className="premium-kicker">Média</p>
            <h2>Photos du bien</h2>
          </div>

          <div className="premium-badge">
            {files.length} photo{files.length > 1 ? "s" : ""}
          </div>
        </div>

        <div className="premium-upload-box">
          <label htmlFor="images" className="premium-upload-zone">
            <div className="premium-upload-icon">＋</div>
            <div>
              <p className="premium-upload-title">Ajouter des photos</p>
              <p className="premium-upload-subtitle">
                La première photo sera utilisée comme image principale du bien.
              </p>
            </div>
          </label>

          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="premium-file-input-hidden"
          />

          {previewItems.length > 0 ? (
            <div className="premium-preview-grid">
              {previewItems.map((item, index) => (
                <div className="premium-preview-card" key={`${item.name}-${index}`}>
                  <div className="premium-preview-image-wrap">
                    <img
                      src={item.url}
                      alt={item.name}
                      className="premium-preview-image"
                    />
                    {index === 0 ? (
                      <div className="premium-primary-badge">Image principale</div>
                    ) : null}
                    <button
                      type="button"
                      className="premium-remove-btn"
                      onClick={() => removeFile(index)}
                    >
                      Supprimer
                    </button>
                  </div>

                  <div className="premium-preview-meta">
                    <p className="premium-preview-name">{item.name}</p>
                    <p className="premium-preview-size">{item.size}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="premium-upload-empty">
              Aucune photo sélectionnée pour le moment.
            </p>
          )}
        </div>
      </div>

      <div className="premium-section">
        <div className="premium-section-head">
          <div>
            <p className="premium-kicker">Réglages</p>
            <h2>Options du bien</h2>
          </div>
        </div>

        <div className="admin-options-grid">
          <div className="admin-option">
            <input
              id="published"
              type="checkbox"
              name="published"
              checked={form.published}
              onChange={handleChange}
            />
            <label htmlFor="published">
              <strong>Publier le bien</strong>
              <span>Le bien sera visible sur le site public.</span>
            </label>
          </div>

          <div className="admin-option">
            <input
              id="featured"
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />
            <label htmlFor="featured">
              <strong>Mettre en avant</strong>
              <span>Le bien pourra être affiché en priorité.</span>
            </label>
          </div>

          <div className="admin-option">
            <input
              id="hasGarden"
              type="checkbox"
              name="hasGarden"
              checked={form.hasGarden}
              onChange={handleChange}
            />
            <label htmlFor="hasGarden">
              <strong>Jardin</strong>
              <span>Le bien possède un espace extérieur jardin.</span>
            </label>
          </div>

          <div className="admin-option">
            <input
              id="hasGarage"
              type="checkbox"
              name="hasGarage"
              checked={form.hasGarage}
              onChange={handleChange}
            />
            <label htmlFor="hasGarage">
              <strong>Garage</strong>
              <span>Place ou box fermé disponible.</span>
            </label>
          </div>

          <div className="admin-option">
            <input
              id="hasTerrace"
              type="checkbox"
              name="hasTerrace"
              checked={form.hasTerrace}
              onChange={handleChange}
            />
            <label htmlFor="hasTerrace">
              <strong>Terrasse</strong>
              <span>Le bien dispose d’une terrasse.</span>
            </label>
          </div>

          <div className="admin-option">
            <input
              id="hasElevator"
              type="checkbox"
              name="hasElevator"
              checked={form.hasElevator}
              onChange={handleChange}
            />
            <label htmlFor="hasElevator">
              <strong>Ascenseur</strong>
              <span>Accès avec ascenseur dans l’immeuble.</span>
            </label>
          </div>
        </div>
      </div>

      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="form-success">{success}</p> : null}

      <div className="premium-form-actions">
        <button type="submit" className="btn btn-gold premium-submit-btn" disabled={loading}>
          {loading ? "Enregistrement..." : "Créer le bien"}
        </button>
      </div>
    </form>
  );
}

function formatFileSize(size) {
  if (!size && size !== 0) return "";
  if (size < 1024) return `${size} o`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}