import Link from "next/link";
import { prisma } from "../../../lib/prisma";

export const metadata = {
  title: "Nos biens | Florian Immo",
  description: "Découvrez les biens immobiliers proposés par Florian Immo.",
};

export default async function BiensPage() {
  const properties = await prisma.property.findMany({
    include: {
      images: {
        orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section className="biens-page">
      <div className="container">
        <div className="biens-header">
          <span className="eyebrow">Nos biens</span>
          <h1>Découvrez nos biens disponibles</h1>
          <p>
            Sélection de maisons, appartements et biens professionnels proposés
            par Florian Immo.
          </p>
        </div>

        {properties.length === 0 ? (
          <div className="empty-state">
            <h2>Aucun bien disponible pour le moment</h2>
            <p>Les biens ajoutés depuis l’administration apparaîtront ici.</p>
          </div>
        ) : (
          <div className="biens-grid">
            {properties.map((property, index) => {
              const image = property.images?.[0]?.url;
              const propertyUrl = `/biens/${property.slug || property.id}`;

              return (
                <article className="bien-card" key={property.id}>
                  <Link href={propertyUrl} className="bien-image-wrap">
                    {index < 4 && <span className="bien-badge">Nouveau</span>}

                    {image ? (
                      <div
                        className="bien-image"
                        style={{ backgroundImage: `url('${image}')` }}
                      />
                    ) : (
                      <div className="bien-image bien-image-empty">
                        Aucune image
                      </div>
                    )}

                    <div className="bien-price">
                      {formatPrice(property.price)}
                    </div>
                  </Link>

                  <div className="bien-content">
                    <h2>
                      <Link href={propertyUrl}>
                        {property.title || "Bien immobilier"}
                      </Link>
                    </h2>

                    <p className="bien-location">
                      {property.city || "Ville non précisée"}
                      {property.postalCode ? ` (${property.postalCode})` : ""}
                      {property.reference ? ` · Réf. ${property.reference}` : ""}
                    </p>

                    <div className="bien-infos">
                      <span>{property.surface ? `${property.surface} m²` : "Surface NC"}</span>
                      <span>{property.rooms ? `${property.rooms} pièces` : "Pièces NC"}</span>
                      <span>{property.bedrooms ? `${property.bedrooms} ch.` : "Ch. NC"}</span>
                    </div>

                    {property.shortDesc ? (
                      <p className="bien-desc">{property.shortDesc}</p>
                    ) : null}

                    <Link href={propertyUrl} className="bien-btn">
                      Voir le détail
                    </Link>
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
  if (!price) return "Prix sur demande";

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(price));
}