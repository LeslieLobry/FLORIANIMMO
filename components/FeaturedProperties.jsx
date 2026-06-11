import Link from "next/link";
import Image from "next/image";
import { prisma } from "../lib/prisma";

export default async function FeaturedProperties() {
  const properties = await prisma.property.findMany({
    take: 3,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: {
        orderBy: [
          { isPrimary: "desc" },
          { position: "asc" },
        ],
        take: 1,
      },
    },
  });

  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Sélection</span>
            <h2>Biens mis en avant</h2>
          </div>

          <Link href="/biens" className="simple-link">
            Voir tous les biens
          </Link>
        </div>

        <div className="property-grid">
          {properties.map((property) => {
            const imageUrl = property.images?.[0]?.url;
            const propertyUrl = `/biens/${property.slug || property.id}`;

            return (
              <article className="property-card" key={property.id}>
                <Link href={propertyUrl} className="property-image-link">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={property.title || "Bien immobilier"}
                      width={500}
                      height={350}
                      className="property-image"
                    />
                  ) : (
                    <div className="property-image-placeholder" />
                  )}
                </Link>

                <div className="property-content">
                  <p className="property-city">
                    {property.city || "Ville non précisée"}
                  </p>

                  <h3>
                    <Link href={propertyUrl}>
                      {property.title || "Bien immobilier"}
                    </Link>
                  </h3>

                  <p className="property-meta">
                    {property.surface
                      ? `${property.surface} m²`
                      : "Surface non précisée"}
                    {property.rooms ? ` • ${property.rooms} pièces` : ""}
                  </p>

                  <div className="property-bottom">
                    <strong>{formatPrice(property.price)}</strong>

                    <Link href={propertyUrl} className="btn btn-small">
                      Voir le bien
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function formatPrice(price) {
  if (!price) return "Prix sur demande";

  return `${Number(price).toLocaleString("fr-FR")} €`;
}