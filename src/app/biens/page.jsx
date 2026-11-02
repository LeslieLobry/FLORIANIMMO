
import Link from "next/link";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nos biens | Florian Immo",
  description:
    "Découvrez les biens immobiliers proposés par Florian Immo.",
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
        orderBy: [
          { isPrimary: "desc" },
          { position: "asc" },
        ],
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Afficher les biens disponibles en premier
  const statusOrder = {
    DISPONIBLE: 0,
    SOUS_OFFRE: 1,
    VENDU: 2,
    LOUE: 3,
  };

  const sortedProperties = [...properties].sort((a, b) => {
    const orderA = statusOrder[a.status] ?? 4;
    const orderB = statusOrder[b.status] ?? 4;

    return orderA - orderB;
  });

  const statusLabels = {
    DISPONIBLE: "Disponible",
    SOUS_OFFRE: "SOUS OFFRE",
    VENDU: "VENDU",
    LOUE: "LOUÉ",
  };

  const statusColors = {
    DISPONIBLE: "#57856a",
    SOUS_OFFRE: "#c59036",
    VENDU: "#b42e38",
    LOUE: "#597e9b",
  };

  return (
    <section className="biens-page">
      <div className="container">
        <div className="biens-header">
          <span className="eyebrow">Nos biens</span>

          <h1>Découvrez nos biens immobiliers</h1>

          <p>
            Découvrez notre sélection de maisons,
            appartements et biens professionnels
            proposés par Florian Immo.
          </p>
        </div>

        {sortedProperties.length === 0 ? (
          <div className="empty-state">
            <h2>Aucun bien disponible pour le moment</h2>

            <p>
              De nouvelles annonces seront
              prochainement disponibles.
            </p>
          </div>
        ) : (
          <div className="biens-grid">
            {sortedProperties.map((property, index) => {
              const image = property.images?.[0]?.url;

              const propertyUrl =
                `/biens/${property.slug || property.id}`;

              const isSold = property.status === "VENDU";
              const isUnderOffer =
                property.status === "SOUS_OFFRE";
              const isRented = property.status === "LOUE";

              const hasSpecialStatus =
                isSold || isUnderOffer || isRented;

              const statusLabel =
                statusLabels[property.status];

              const statusColor =
                statusColors[property.status];

              return (
                <article
                  className="bien-card"
                  key={property.id}
                >
                  <Link
                    href={propertyUrl}
                    className="bien-image-wrap"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* BADGE NOUVEAU */}

                    {!hasSpecialStatus && index < 4 && (
                      <span className="bien-badge">
                        Nouveau
                      </span>
                    )}

                    {/* IMAGE DU BIEN */}

                    {image ? (
                      <div
                        className="bien-image"
                        style={{
                          backgroundImage: `url("${image}")`,
                        }}
                      />
                    ) : (
                      <div className="bien-image bien-image-empty">
                        Aucune image
                      </div>
                    )}

                    {/* BANDEAU STATUT */}

                    {hasSpecialStatus && (
                      <div
                        style={{
                          position: "absolute",
                          top: "20px",
                          right: "-48px",
                          width: "200px",
                          padding: "10px 0",
                          backgroundColor: statusColor,
                          color: "#ffffff",
                          textAlign: "center",
                          fontWeight: "700",
                          fontSize: "14px",
                          letterSpacing: "2px",
                          transform: "rotate(45deg)",
                          boxShadow:
                            "0 3px 10px rgba(0,0,0,0.2)",
                          zIndex: 5,
                        }}
                      >
                        {statusLabel}
                      </div>
                    )}

                    {/* PRIX */}

                    <div className="bien-price">
                      {formatPrice(property.price)}
                    </div>
                  </Link>

                  {/* INFORMATIONS DU BIEN */}

                  <div className="bien-content">
                    <h2>
                      <Link href={propertyUrl}>
                        {property.title ||
                          "Bien immobilier"}
                      </Link>
                    </h2>

                    {/* STATUT SOUS LE TITRE */}

                    {hasSpecialStatus && (
                      <span
                        style={{
                          display: "inline-block",
                          marginBottom: "10px",
                          padding: "5px 12px",
                          borderRadius: "5px",
                          backgroundColor: statusColor,
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: "700",
                          letterSpacing: "1px",
                        }}
                      >
                        {statusLabel}
                      </span>
                    )}

                    <p className="bien-location">
                      {property.city ||
                        "Ville non précisée"}

                      {property.postalCode
                        ? ` (${property.postalCode})`
                        : ""}

                      {property.reference
                        ? ` · Réf. ${property.reference}`
                        : ""}
                    </p>

                    <div className="bien-infos">
                      <span>
                        {property.surface
                          ? `${property.surface} m²`
                          : "Surface NC"}
                      </span>

                      <span>
                        {property.rooms
                          ? `${property.rooms} pièces`
                          : "Pièces NC"}
                      </span>

                      <span>
                        {property.bedrooms
                          ? `${property.bedrooms} ch.`
                          : "Ch. NC"}
                      </span>
                    </div>

                    {property.shortDesc && (
                      <p className="bien-desc">
                        {property.shortDesc}
                      </p>
                    )}

                    <Link
                      href={propertyUrl}
                      className="bien-btn"
                    >
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
  if (price === null || price === undefined) {
    return "Prix sur demande";
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(price));
}
