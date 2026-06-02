import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../lib/prisma";

export async function generateMetadata({ params }) {
  const property = await prisma.property.findUnique({
    where: { slug: params.slug },
  });

  if (!property) {
    return { title: "Bien introuvable | Florian Immo" };
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
  const property = await prisma.property.findUnique({
    where: { slug: params.slug },
    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!property || !property.published || property.status === "ARCHIVE") {
    notFound();
  }

  return (
    <section className="section">
      <div className="container">
        <div className="breadcrumb">
          <Link href="/">Accueil</Link>
          <span> / </span>
          <Link href="/biens">Biens</Link>
          <span> / </span>
          <span>{property.title}</span>
        </div>

        <div className="property-detail-grid">
          <div>
            <div className="property-gallery">
              {property.images.length > 0 ? (
                property.images.map((image) => (
                  <div
                    key={image.id}
                    className="property-gallery-image"
                    style={{ backgroundImage: `url('${image.url}')` }}
                  />
                ))
              ) : (
                <div className="property-gallery-image property-image-empty">
                  Aucune image
                </div>
              )}
            </div>
          </div>

          <aside className="property-sidebar">
            <span className="eyebrow">
              {property.transaction} • {property.status}
            </span>

            <h1>{property.title}</h1>

            <p className="property-location">
              {property.city}
              {property.postalCode ? ` (${property.postalCode})` : ""}
            </p>

            <p className="property-price-detail">
              {formatPrice(property.price)}
            </p>

            <ul className="property-features-list">
              <li><strong>Type :</strong> {property.type}</li>
              <li><strong>Surface :</strong> {property.surface ? `${property.surface} m²` : "Non précisée"}</li>
              <li><strong>Pièces :</strong> {property.rooms || "Non précisé"}</li>
              <li><strong>Chambres :</strong> {property.bedrooms || "Non précisé"}</li>
              <li><strong>Salles de bain :</strong> {property.bathrooms || "Non précisé"}</li>
              <li><strong>DPE :</strong> {property.dpe || "Non précisé"}</li>
              <li><strong>GES :</strong> {property.ges || "Non précisé"}</li>
            </ul>

            <div className="property-actions">
              <Link href="/contact" className="btn btn-gold">
                Contacter l’agence
              </Link>
              <Link href={`/rendez-vous?property=${property.slug}`} className="btn btn-outline">
                Prendre rendez-vous
              </Link>
            </div>
          </aside>
        </div>

        <div className="property-description-block">
          <h2>Description</h2>
          <p>{property.description || "Description bientôt disponible."}</p>
        </div>
      </div>
    </section>
  );
}

function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(price));
}