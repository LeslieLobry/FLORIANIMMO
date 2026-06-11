import Link from "next/link";
import AdminNav from "../../../components/admin/AdminNav";
import DeletePropertyButton from "../../../components/admin/DeletePropertyButton";
import { prisma } from "../../../lib/prisma";

export const metadata = {
  title: "Admin Biens | Florian Immo",
};

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      images: {
        orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
        take: 1,
      },
    },
  });

  return (
    <>
      <AdminNav />

      <section className="admin-section">
        <div className="container">
          <div className="admin-page-head">
            <div>
              <span className="eyebrow">Administration</span>
              <h1>Gestion des biens</h1>
              <p className="admin-page-subtitle">
                Ajoutez, modifiez ou supprimez les annonces immobilières du site.
              </p>
            </div>

            <Link href="/admin/biens/nouveau" className="btn btn-gold">
              Ajouter un bien
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="admin-empty-box">
              <h2>Aucun bien enregistré</h2>
              <p>Les biens ajoutés depuis l’administration apparaîtront ici.</p>
            </div>
          ) : (
            <div className="admin-properties-grid">
              {properties.map((property) => {
                const imageUrl = property.images?.[0]?.url;
                const propertyUrl = `/biens/${property.slug || property.id}`;

                return (
                  <article className="admin-property-card-v2" key={property.id}>
                    <div className="admin-property-thumb">
                      {imageUrl ? (
                        <div
                          className="admin-property-thumb-img"
                          style={{ backgroundImage: `url('${imageUrl}')` }}
                        />
                      ) : (
                        <div className="admin-property-thumb-empty">
                          Aucune image
                        </div>
                      )}

                      <span
                        className={`admin-status-pill ${
                          property.published ? "is-published" : "is-draft"
                        }`}
                      >
                        {property.published ? "Publié" : "Brouillon"}
                      </span>
                    </div>

                    <div className="admin-property-card-body">
                      <div>
                        <p className="admin-property-city">
                          {property.city || "Ville non précisée"}
                          {property.postalCode ? ` (${property.postalCode})` : ""}
                        </p>

                        <h2>{property.title}</h2>

                        <p className="admin-property-meta">
                          {formatPrice(property.price)}
                          {" • "}
                          {formatValue(property.type)}
                          {" • "}
                          {formatTransaction(property.transaction)}
                        </p>
                      </div>

                      <div className="admin-property-actions">
                        <Link href={propertyUrl} className="btn btn-outline">
                          Voir
                        </Link>

                        <Link
                          href={`/admin/biens/${property.id}/modifier`}
                          className="btn btn-gold"
                        >
                          Modifier
                        </Link>

                        <DeletePropertyButton propertyId={property.id} />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
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

function formatTransaction(transaction) {
  if (!transaction) return "Bien";
  if (transaction === "VENTE") return "Vente";
  if (transaction === "LOCATION") return "Location";
  return transaction;
}

function formatValue(value) {
  if (!value) return "Non précisé";
  return String(value).replaceAll("_", " ");
}