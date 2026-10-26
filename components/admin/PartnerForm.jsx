
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PartnerForm({ partner = null }) {
  const router = useRouter();
  const isEditing = Boolean(partner?.id);

  const [form, setForm] = useState({
    name: partner?.name ?? "",
    description: partner?.description ?? "",
    website: partner?.website ?? "",
    position: partner?.position ?? 0,
    published: partner?.published ?? true,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    partner?.logo ?? ""
  );
  const [removeLogo, setRemoveLogo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/avif",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Format de logo non accepté.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Le logo ne doit pas dépasser 5 Mo.");
      e.target.value = "";
      return;
    }

    setError("");
    setImage(file);
    setRemoveLogo(false);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(String(reader.result || ""));
    };

    reader.readAsDataURL(file);
  }

  function handleRemoveLogo() {
    setImage(null);
    setPreview("");
    setRemoveLogo(true);

    const input = document.getElementById("partner-logo");
    if (input) input.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      formData.append("removeLogo", String(removeLogo));

      if (image) {
        formData.append("image", image);
      }

      const url = isEditing
        ? `/api/admin/partenaires/${partner.id}`
        : "/api/admin/partenaires";

      const response = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
          data.message ||
          "Erreur lors de l'enregistrement."
        );
      }

      router.push("/admin/partenaires");
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
      <div className="premium-section">
        <div className="premium-section-head">
          <div>
            <p className="premium-kicker">
              Ils nous font confiance
            </p>
            <h2>Informations du partenaire</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-field admin-field-full">
            <label htmlFor="partner-name">
              Nom du partenaire *
            </label>
            <input
              id="partner-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Ex : Nom de l'entreprise"
              required
            />
          </div>

          <div className="admin-field admin-field-full">
            <label htmlFor="partner-description">
              Description
            </label>
            <textarea
              id="partner-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Présentez brièvement ce partenaire..."
            />
          </div>

          <div className="admin-field admin-field-full">
            <label htmlFor="partner-website">
              Site internet
            </label>
            <input
              id="partner-website"
              name="website"
              type="text"
              value={form.website}
              onChange={handleChange}
              placeholder="https://www.exemple.fr"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="partner-position">
              Ordre d'affichage
            </label>
            <input
              id="partner-position"
              name="position"
              type="number"
              min="0"
              step="1"
              value={form.position}
              onChange={handleChange}
            />
            <p>
              0 apparaît en premier, puis 1, 2, 3...
            </p>
          </div>
        </div>
      </div>

      <div className="premium-section">
        <div className="premium-section-head">
          <div>
            <p className="premium-kicker">Identité visuelle</p>
            <h2>Logo du partenaire</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-field admin-field-full">
            <label htmlFor="partner-logo">
              Choisir un logo
            </label>
            <input
              id="partner-logo"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
              onChange={handleImageChange}
            />
            <p>
              PNG, JPG, WebP, GIF ou AVIF, 5 Mo maximum.
              Privilégiez un PNG transparent.
            </p>
          </div>
        </div>

        {preview && (
          <div className="premium-preview-grid">
            <div className="premium-preview-card">
              <div className="premium-preview-image-wrap">
                <img
                  src={preview}
                  alt="Aperçu du logo"
                  className="premium-preview-image"
                  style={{ objectFit: "contain" }}
                />
              </div>
              <button
                type="button"
                className="article-action delete"
                onClick={handleRemoveLogo}
              >
                Retirer le logo
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="premium-section">
        <div className="premium-section-head">
          <div>
            <p className="premium-kicker">Visibilité</p>
            <h2>Publication</h2>
          </div>
        </div>

        <div className="admin-options-grid">
          <div className="admin-option">
            <input
              id="partner-published"
              name="published"
              type="checkbox"
              checked={form.published}
              onChange={handleChange}
            />
            <label htmlFor="partner-published">
              <strong>Afficher sur le site</strong>
            </label>
          </div>
        </div>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="premium-form-actions">
        <Link
          href="/admin/partenaires"
          className="btn btn-outline"
        >
          Annuler
        </Link>

        <button
          type="submit"
          className="btn btn-gold premium-submit-btn"
          disabled={loading}
        >
          {loading
            ? "Enregistrement..."
            : isEditing
            ? "Enregistrer les modifications"
            : "Ajouter le partenaire"}
        </button>
      </div>
    </form>
  );
}
