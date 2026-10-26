
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ArticleForm({ article = null }) {
  const router = useRouter();
  const isEditing = Boolean(article?.id);

  const [form, setForm] = useState({
    title: article?.title ?? "",
    excerpt: article?.excerpt ?? "",
    content: article?.content ?? "",
    author: article?.author ?? "Florian Immo",
    published: article?.published ?? false,
    featured: article?.featured ?? false,
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(
    article?.coverImage ?? ""
  );

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
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5 Mo.");
      e.target.value = "";
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

    if (loading) return;

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

      const url = isEditing
        ? `/api/admin/articles/${article.id}`
        : "/api/admin/articles";

      const res = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data.message ||
          data.error ||
          "Erreur lors de l'enregistrement."
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
            <h2>
              {isEditing
                ? "Modifier l'article"
                : "Informations de l'article"}
            </h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-field admin-field-full">
            <label htmlFor="article-title">
              Titre de l'article *
            </label>
            <input
              id="article-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex : 5 conseils pour vendre son bien"
              required
            />
          </div>

          <div className="admin-field admin-field-full">
            <label htmlFor="article-excerpt">Résumé</label>
            <textarea
              id="article-excerpt"
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              rows={3}
              placeholder="Petit résumé visible sur la page actualités..."
            />
          </div>

          <div className="admin-field admin-field-full">
            <label htmlFor="article-content">
              Contenu de l'article *
            </label>
            <textarea
              id="article-content"
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={15}
              placeholder="Rédigez votre article ici..."
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="article-author">Auteur</label>
            <input
              id="article-author"
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
            <p className="premium-kicker">Illustration</p>
            <h2>Photo principale</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-field admin-field-full">
            <label htmlFor="article-image">
              {isEditing
                ? "Changer la photo (facultatif)"
                : "Choisir une photo"}
            </label>

            <input
              id="article-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            <p>
              Formats image acceptés — 5 Mo maximum.
              {isEditing &&
                " Sans nouvelle photo, l'image actuelle sera conservée."}
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
            <p className="premium-kicker">Publication</p>
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
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="premium-form-actions">
        <Link
          href="/admin/articles"
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
            : form.published
            ? "Publier l'article"
            : "Enregistrer le brouillon"}
        </button>
      </div>
    </form>
  );
}
