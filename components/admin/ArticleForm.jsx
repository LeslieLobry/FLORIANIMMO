
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ArticleForm() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    author: "Florian Immo",
    published: false,
    featured: false,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

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

    if (!file.type.startsWith("image/")) {
      setError("Veuillez choisir une image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    setError("");
    setImage(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      if (image) {
        formData.append("image", image);
      }

      const res = await fetch("/api/admin/articles", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Erreur lors de l'enregistrement."
        );
      }

      router.push("/admin/articles");
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
              Actualités immobilières
            </p>
            <h2>Informations de l'article</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-field admin-field-full">
            <label>Titre de l'article *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex : 5 conseils pour vendre son bien"
              required
            />
          </div>

          <div className="admin-field admin-field-full">
            <label>Résumé</label>
            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              rows={3}
              placeholder="Petit résumé visible sur la page actualités..."
            />
          </div>

          <div className="admin-field admin-field-full">
            <label>Contenu de l'article *</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={15}
              placeholder="Rédigez votre article ici..."
              required
            />
          </div>

          <div className="admin-field">
            <label>Auteur</label>
            <input
              name="author"
              value={form.author}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="premium-section">
        <div className="premium-section-head">
          <div>
            <p className="premium-kicker">
              Illustration
            </p>
            <h2>Photo principale</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-field admin-field-full">
            <label>Choisir une photo</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            <p>
              Formats image acceptés — 5 Mo maximum.
            </p>
          </div>
        </div>

        {preview && (
          <div className="premium-preview-grid">
            <div className="premium-preview-card">
              <div className="premium-preview-image-wrap">
                <img
                  src={preview}
                  alt="Aperçu de l'article"
                  className="premium-preview-image"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="premium-section">
        <div className="premium-section-head">
          <div>
            <p className="premium-kicker">
              Publication
            </p>
            <h2>Options de l'article</h2>
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
              <strong>Publier l'article</strong>
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
              <strong>Mettre à la une</strong>
            </label>
          </div>
        </div>
      </div>

      {error && (
        <p className="form-error">{error}</p>
      )}

      <div className="premium-form-actions">
        <button
          type="submit"
          className="btn btn-gold premium-submit-btn"
          disabled={loading}
        >
          {loading
            ? "Enregistrement..."
            : form.published
            ? "Publier l'article"
            : "Enregistrer le brouillon"}
        </button>
      </div>
    </form>
  );
}
