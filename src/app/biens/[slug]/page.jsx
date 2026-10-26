
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PropertyGallery from "@/components/PropertyGallery";

export const dynamic = "force-dynamic";

async function getProperty(slug) {
  return prisma.property.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
      published: true,
      status: { not: "ARCHIVE" },
    },
    include: {
      images: {
        orderBy: [
          { isPrimary: "desc" },
          { position: "asc" },
        ],
      },
    },
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    return {
      title: "Bien introuvable | Florian Immo",
    };
  }

  return {
    title: `${property.title} | Florian Immo`,
    description:
      property.shortDesc ||
      property.description?.slice(0, 160) ||
      "Découvrez ce bien immobilier proposé par Florian Immo.",
  };
}

export default async function PropertyDetailPage({ params }) {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) {
    notFound();
  }

  return (
    <main className="property-detail-page">

      {/* EN-TÊTE DU BIEN */}

      <section className="property-detail-hero">
        <div className="container">

          <div className="breadcrumb">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <Link href="/biens">Biens</Link>
            <span>/</span>
            <span>{property.title}</span>
          </div>

          <div className="property-detail-hero-grid">
            <div>
              <span className="property-status-badge">
                {formatTransaction(property.transaction)}
              </span>

              <h1>{property.title}</h1>

              <p className="property-location">
                {property.city || "Ville non précisée"}
                {property.postalCode
                  ? ` (${property.postalCode})`
                  : ""}
              </p>
            </div>

            <div className="property-price-box">
              <span>Prix</span>
              <strong>{formatPrice(property.price)}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* GALERIE ET CARACTÉRISTIQUES */}

      <section className="property-detail-content">
        <div className="container">

          <div className="property-main-image">
            <PropertyGallery images={property.images} />
          </div>

          <div className="property-detail-layout">
            <div className="property-detail-left">

              {/* CARACTÉRISTIQUES PRINCIPALES */}

              <div className="property-features-grid">
                <div>
                  <span>Surface habitable</span>
                  <strong>
                    {formatSurface(property.surface)}
                  </strong>
                </div>

                <div>
                  <span>Surface terrain</span>
                  <strong>
                    {formatSurface(property.landSurface)}
                  </strong>
                </div>

                <div>
                  <span>Pièces</span>
                  <strong>
                    {formatCount(property.rooms)}
                  </strong>
                </div>

                <div>
                  <span>Chambres</span>
                  <strong>
                    {formatCount(property.bedrooms)}
                  </strong>
                </div>
              </div>

              {/* DESCRIPTION */}

              <div className="property-description-block">
                <span className="eyebrow">Description</span>
                <h2>À propos de ce bien</h2>

                <p style={{ whiteSpace: "pre-line" }}>
                  {property.description ||
                    "Description bientôt disponible."}
                </p>
              </div>

              {/* TOUTES LES CARACTÉRISTIQUES */}

              <div className="property-info-block">
                <span className="eyebrow">
                  Les détails
                </span>
                <h2>Caractéristiques du bien</h2>

                <div className="property-info-list">

                  <Info
                    label="Type de bien"
                    value={formatValue(property.type)}
                  />

                  <Info
                    label="Transaction"
                    value={formatTransaction(
                      property.transaction
                    )}
                  />

                  <Info
                    label="Statut"
                    value={formatValue(property.status)}
                  />

                  <Info
                    label="Surface habitable"
                    value={formatSurface(property.surface)}
                  />

                  <Info
                    label="Surface du terrain"
                    value={formatSurface(
                      property.landSurface
                    )}
                  />

                  <Info
                    label="Orientation"
                    value={formatOrientation(
                      property.orientation
                    )}
                  />

                  <Info
                    label="Nombre de pièces"
                    value={formatCount(property.rooms)}
                  />

                  <Info
                    label="Chambres"
                    value={formatCount(property.bedrooms)}
                  />

                  <Info
                    label="Salles de bain"
                    value={formatCount(property.bathrooms)}
                  />

                  {property.yearBuilt != null && (
                    <Info
                      label="Année de construction"
                      value={property.yearBuilt}
                    />
                  )}

                  {property.floor != null && (
                    <Info
                      label="Étage"
                      value={property.floor}
                    />
                  )}

                  <Info
                    label="DPE"
                    value={property.dpe || "Non précisé"}
                  />

                  <Info
                    label="GES"
                    value={property.ges || "Non précisé"}
                  />

                </div>
              </div>

              {/* ÉQUIPEMENTS */}

              {(property.hasGarden ||
                property.hasGarage ||
                property.hasTerrace ||
                property.hasElevator) && (
                <div
                  className="property-info-block"
                  style={{ marginTop: 26 }}
                >
                  <span className="eyebrow">
                    Prestations
                  </span>
                  <h2>Équipements et extérieurs</h2>

                  <div className="property-info-list">
                    {property.hasGarden && (
                      <Info label="Jardin" value="Oui" />
                    )}

                    {property.hasGarage && (
                      <Info label="Garage" value="Oui" />
                    )}

                    {property.hasTerrace && (
                      <Info label="Terrasse" value="Oui" />
                    )}

                    {property.hasElevator && (
                      <Info label="Ascenseur" value="Oui" />
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* CONTACT */}

            <aside className="property-contact-card">
              <span className="eyebrow">
                Intéressé par ce bien ?
              </span>

              <h2>Contactez Florian</h2>

              <p>
                Vous souhaitez visiter ce bien ou obtenir
                plus d'informations ? Florian vous accompagne
                dans votre projet immobilier.
              </p>

              <div className="property-contact-actions">
                <Link
                  href="/contact"
                  className="btn btn-gold"
                >
                  Contacter l'agence
                </Link>

                <Link
                  href={`/rendez-vous?property=${encodeURIComponent(
                    property.slug || property.id
                  )}`}
                  className="btn btn-outline"
                >
                  Prendre rendez-vous
                </Link>
              </div>

              <div className="property-contact-note">
                Réponse rapide et accompagnement personnalisé.
              </div>
            </aside>

          </div>
        </div>
      </section>
    </main>
  );
}

// COMPOSANT DE CARACTÉRISTIQUE

function Info({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

// FORMATAGE DU PRIX

function formatPrice(price) {
  if (price == null) return "Prix sur demande";

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(price));
}

// FORMATAGE DES SURFACES

function formatSurface(surface) {
  if (surface == null) return "Non précisée";

  return `${new Intl.NumberFormat("fr-FR", {
    maximumFractionDigits: 2,
  }).format(Number(surface))} m²`;
}

// FORMATAGE DES NOMBRES

function formatCount(value) {
  if (value == null) return "Non précisé";

  return new Intl.NumberFormat("fr-FR").format(value);
}

// TYPE DE TRANSACTION

function formatTransaction(transaction) {
  if (transaction === "VENTE") return "À vendre";
  if (transaction === "LOCATION") return "À louer";

  return "Non précisée";
}

// FORMATAGE DE L'ORIENTATION

function formatOrientation(orientation) {
  if (!orientation) return "Non précisée";

  const labels = {
    NORD: "Nord",
    SUD: "Sud",
    EST: "Est",
    OUEST: "Ouest",
    NORD_EST: "Nord-Est",
    NORD_OUEST: "Nord-Ouest",
    SUD_EST: "Sud-Est",
    SUD_OUEST: "Sud-Ouest",
  };

  const key = String(orientation)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[\s-]+/g, "_");

  return labels[key] || orientation;
}

// FORMATAGE DES AUTRES VALEURS

function formatValue(value) {
  if (!value) return "Non précisé";

  const labels = {
    MAISON: "Maison",
    APPARTEMENT: "Appartement",
    IMMEUBLE: "Immeuble",
    TERRAIN: "Terrain",
    LOCAL: "Local commercial",
    BUREAU: "Bureau",
    AUTRE: "Autre",
    DISPONIBLE: "Disponible",
    SOUS_OFFRE: "Sous offre",
    VENDU: "Vendu",
    LOUE: "Loué",
    ARCHIVE: "Archivé",
  };

  return labels[value] ||
    String(value).replaceAll("_", " ");
}
