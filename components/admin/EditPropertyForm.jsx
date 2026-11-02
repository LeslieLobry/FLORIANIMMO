
"use client";

import { useEffect, useState } from "react";
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

const statuts = [
  { value: "DISPONIBLE", label: "Disponible" },
  { value: "SOUS_OFFRE", label: "Sous offre" },
  { value: "VENDU", label: "Vendu" },
  { value: "LOUE", label: "Loué" },
  { value: "ARCHIVE", label: "Archivé" },
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

  // INFORMATIONS DU BIEN
  const [form, setForm] = useState({
    title: property.title ?? "",
    type: property.type ?? "MAISON",
    transaction: property.transaction ?? "VENTE",
    status: property.status ?? "DISPONIBLE",
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

  // PHOTOS EXISTANTES
  const [existingImages, setExistingImages] = useState(
    property.images ?? []
  );

  // NOUVELLES PHOTOS
  const [newImages, setNewImages] = useState([]);

  // PHOTOS À SUPPRIMER
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // PHOTO PRINCIPALE
  const initialPrimary =
    property.images?.find((image) => image.isPrimary) ??
    property.images?.[0];

  const [primaryImageId, setPrimaryImageId] = useState(
    initialPrimary ? `existing:${initialPrimary.id}` : null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // NETTOYAGE DES PRÉVISUALISATIONS
  useEffect(() => {
    return () => {
      // Chaque prévisualisation est libérée lors
      // de son retrait ou au démontage du formulaire.
    };
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  // AJOUTER DES PHOTOS
  function handleAddImages(e) {
    const files = Array.from(e.target.files ?? []);

    if (!files.length) return;

    const validFiles = files.filter(
      (file) =>
        ["image/jpeg", "image/png", "image/webp"].includes(
          file.type
        ) &&
        file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      setError(
        "Certaines photos ont été ignorées. Formats autorisés : JPG, PNG, WebP. Maximum 10 Mo."
      );
    } else {
      setError("");
    }

    const images = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...images]);

    if (
      !primaryImageId &&
      !existingImages.length &&
      images.length
    ) {
      setPrimaryImageId(`new:${images[0].id}`);
    }

    e.target.value = "";
  }

  // SUPPRIMER UNE PHOTO EXISTANTE
  function handleDeleteExisting(imageId) {
    const remaining = existingImages.filter(
      (image) => image.id !== imageId
    );

    setExistingImages(remaining);

    setImagesToDelete((prev) =>
      prev.includes(imageId) ? prev : [...prev, imageId]
    );

    if (primaryImageId === `existing:${imageId}`) {
      if (remaining.length) {
        setPrimaryImageId(`existing:${remaining[0].id}`);
      } else if (newImages.length) {
        setPrimaryImageId(`new:${newImages[0].id}`);
      } else {
        setPrimaryImageId(null);
      }
    }
  }

  // SUPPRIMER UNE NOUVELLE PHOTO
  function handleDeleteNew(imageId) {
    const image = newImages.find(
      (item) => item.id === imageId
    );

    if (image) {
      URL.revokeObjectURL(image.preview);
    }

    const remaining = newImages.filter(
      (item) => item.id !== imageId
    );

    setNewImages(remaining);

    if (primaryImageId === `new:${imageId}`) {
      if (existingImages.length) {
        setPrimaryImageId(
          `existing:${existingImages[0].id}`
        );
      } else if (remaining.length) {
        setPrimaryImageId(`new:${remaining[0].id}`);
      } else {
        setPrimaryImageId(null);
      }
    }
  }

  // ENVOYER UNE PHOTO SUR CLOUDINARY
  async function uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      "/api/admin/biens/upload-photo",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message ||
          data.error ||
          "Impossible d'envoyer une photo."
      );
    }

    const url = data.url || data.secure_url;

    if (!url) {
      throw new Error(
        "L'envoi de la photo n'a pas retourné d'URL."
      );
    }

    return { url };
  }

  // ENREGISTRER LES MODIFICATIONS
  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      // 1. Envoyer les nouvelles photos
      const uploadedImages = [];

      for (const image of newImages) {
        const uploaded = await uploadImage(image.file);

        uploadedImages.push({
          id: image.id,
          url: uploaded.url,
        });
      }

      // 2. Trouver la photo principale
      let selectedExistingId = null;
      let selectedNewIndex = null;

      if (primaryImageId?.startsWith("existing:")) {
        selectedExistingId = primaryImageId.replace(
          "existing:",
          ""
        );
      }

      if (primaryImageId?.startsWith("new:")) {
        const selectedId = primaryImageId.replace(
          "new:",
          ""
        );

        const index = uploadedImages.findIndex(
          (image) => image.id === selectedId
        );

        if (index >= 0) {
          selectedNewIndex = index;
        }
      }

      // 3. Préparer les données
      const payload = {
        ...form,
        imagesToDelete,
        newImages: uploadedImages.map((image) => ({
          url: image.url,
        })),
        primaryImageId: selectedExistingId,
        primaryNewImageIndex: selectedNewIndex,
      };

      // 4. Modifier le bien
      const res = await fetch(
        `/api/admin/biens/${property.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
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

      // 5. Retour à la liste
      router.push("/admin/biens");
      router.refresh();
    } catch (err) {
      setError(
        err.message || "Une erreur est survenue."
      );
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
            <label htmlFor="type">
              Type de bien
            </label>

            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="MAISON">Maison</option>
              <option value="APPARTEMENT">
                Appartement
              </option>
              <option value="IMMEUBLE">Immeuble</option>
              <option value="TERRAIN">Terrain</option>
              <option value="LOCAL">
                Local commercial
              </option>
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

      {/* STATUT DU BIEN */}

      <div className="premium-section">
        <div className="premium-section-head">
          <div>
            <p className="premium-kicker">
              Commercialisation
            </p>
            <h2>Statut du bien</h2>
          </div>
        </div>

        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="status">
              Situation actuelle
            </label>

            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              {statuts.map((statut) => (
                <option
                  key={statut.value}
                  value={statut.value}
                >
                  {statut.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {form.status === "VENDU" && (
          <p
            style={{
              marginTop: "15px",
              color: "#9b3232",
              fontWeight: 600,
            }}
          >
            Ce bien sera marqué comme VENDU.
          </p>
        )}

        {form.status === "SOUS_OFFRE" && (
          <p style={{ marginTop: "15px" }}>
            Une offre a été reçue pour ce bien.
          </p>
        )}
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

      {/* GESTION DES PHOTOS */}

      <div className="premium-section">
        <div className="premium-section-head">
          <div>
            <p className="premium-kicker">
              Galerie immobilière
            </p>
            <h2>Photos du bien</h2>
          </div>
        </div>

        <p style={{ marginBottom: "20px" }}>
          Ajoutez ou supprimez des photos et
          sélectionnez celle qui apparaîtra
          en premier sur l'annonce.
        </p>

        {/* PHOTOS EXISTANTES */}

        {existingImages.length > 0 && (
          <>
            <h3 style={{ marginBottom: "15px" }}>
              Photos enregistrées
            </h3>

            <div className="premium-preview-grid">
              {existingImages.map((image, index) => {
                const selected =
                  primaryImageId ===
                  `existing:${image.id}`;

                return (
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

                      {selected && (
                        <div className="premium-primary-badge">
                          Image principale
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-outline"
                        disabled={loading}
                        onClick={() =>
                          setPrimaryImageId(
                            `existing:${image.id}`
                          )
                        }
                      >
                        {selected
                          ? "★ Photo principale"
                          : "Définir comme principale"}
                      </button>

                      <button
                        type="button"
                        disabled={loading}
                        onClick={() =>
                          handleDeleteExisting(image.id)
                        }
                        style={{
                          color: "#a32b2b",
                          background: "#fff0f0",
                          border: "1px solid #e6b5b5",
                          padding: "10px",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        Supprimer cette photo
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* NOUVELLES PHOTOS */}

        {newImages.length > 0 && (
          <>
            <h3
              style={{
                marginTop: "25px",
                marginBottom: "15px",
              }}
            >
              Nouvelles photos
            </h3>

            <div className="premium-preview-grid">
              {newImages.map((image, index) => {
                const selected =
                  primaryImageId ===
                  `new:${image.id}`;

                return (
                  <div
                    className="premium-preview-card"
                    key={image.id}
                  >
                    <div className="premium-preview-image-wrap">
                      <img
                        src={image.preview}
                        alt={`Nouvelle photo ${index + 1}`}
                        className="premium-preview-image"
                      />

                      {selected && (
                        <div className="premium-primary-badge">
                          Image principale
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-outline"
                        disabled={loading}
                        onClick={() =>
                          setPrimaryImageId(
                            `new:${image.id}`
                          )
                        }
                      >
                        {selected
                          ? "★ Photo principale"
                          : "Définir comme principale"}
                      </button>

                      <button
                        type="button"
                        disabled={loading}
                        onClick={() =>
                          handleDeleteNew(image.id)
                        }
                        style={{
                          color: "#a32b2b",
                          background: "#fff0f0",
                          border: "1px solid #e6b5b5",
                          padding: "10px",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
                      >
                        Retirer cette photo
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* AJOUT DE PHOTOS */}

        <div
          className="admin-field admin-field-full"
          style={{ marginTop: "25px" }}
        >
          <label htmlFor="newPropertyImages">
            Ajouter des photos
          </label>

          <input
            id="newPropertyImages"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={loading}
            onChange={handleAddImages}
          />

          <small
            style={{
              display: "block",
              marginTop: "8px",
            }}
          >
            Formats JPG, PNG ou WebP.
            Maximum 10 Mo par image.
          </small>
        </div>

        {existingImages.length === 0 &&
          newImages.length === 0 && (
            <p>Aucune photo sélectionnée.</p>
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
            ? "Enregistrement en cours..."
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

function Checkbox({
  label,
  name,
  checked,
  onChange,
}) {
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
