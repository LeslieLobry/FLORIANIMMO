import Link from "next/link";
import { prisma } from "../../../lib/prisma";

export const metadata = {
  title: "Biens immobiliers | Florian Immo",
  description: "Découvrez tous les biens immobiliers proposés par Florian Immo.",
};

export default async function BiensPage() {
  const properties = await prisma.property.findMany({
    where: {
      published: true,
      status: {
        not: "ARCHIVE",
      },
    },
    include: {
      images: {
        orderBy: {
          position: "asc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="section">
      <div className="container">
        <div className="page-hero">
          <span className="eyebrow">Nos biens</span>
          <h1>Découvrez notre sélection immobilière</h1>
          <p>
            Parcourez les biens disponibles à la vente ou à la location et
            contactez-nous pour organiser une visite.
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="empty-state">
            <h2>Aucun bien disponible pour le moment</h2>
            <p>Les biens ajoutés depuis l’admin apparaîtront ici.</p>
          </div>
        ) : (
          <div className="property-grid">
            {properties.map((property) => {
              const image = property.images[0]?.url || null;

              return (
                <article className="property-card" key={property.id}>
                  {image ? (
                    <div
                      className="property-image-real"
                      style={{ backgroundImage: `url('${image}')` }}
                    />
                  ) : (
                    <div className="property-image-real property-image-empty">
                      Aucune image
                    </div>
                  )}

                  <div className="property-content">
                    <p className="property-city">
                      {property.city}
                      {property.postalCode ? ` (${property.postalCode})` : ""}
                    </p>

                    <h2 className="property-title-card">{property.title}</h2>

                    <p className="property-meta">
                      {property.surface ? `${property.surface} m²` : "Surface NC"}
                      {" • "}
                      {property.rooms ? `${property.rooms} pièces` : "Pièces NC"}
                      {" • "}
                      {property.type}
                    </p>

                    {property.shortDesc ? (
                      <p className="property-desc-card">{property.shortDesc}</p>
                    ) : null}

                    <div className="property-bottom">
                      <strong>{formatPrice(property.price)}</strong>

                      <Link href={`/biens/${property.slug}`} className="btn btn-small">
                        Voir le bien
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
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