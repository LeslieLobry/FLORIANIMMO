import Link from "next/link";
import Image from "next/image";
import AdminNav from "../../../../components/admin/AdminNav";
import { prisma } from "../../../../lib/prisma";

export const metadata = {
  title: "Admin Biens | Florian Immo",
};

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
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
            </div>

            <Link href="/admin/biens/nouveau" className="btn btn-gold">
              Ajouter un bien
            </Link>
          </div>

          {properties.length === 0 ? (
            <div className="admin-empty-box">
              <h2>Aucun bien enregistré</h2>
              <p>Le client pourra ajouter ses biens ici au fur et à mesure.</p>
            </div>
          ) : (
            <div className="admin-cards-grid">
              {properties.map((property) => {
                const image = property.images[0]?.url || null;

                return (
                  <article className="admin-property-card" key={property.id}>
                    <div className="admin-property-image">
                      {image ? (
                        <Image
                          src={image}
                          alt={property.title}
                          fill
                          className="admin-property-img-tag"
                        />
                      ) : (
                        <div className="admin-property-no-image">Aucune photo</div>
                      )}
                    </div>

                    <div className="admin-property-content">
                      <h2>{property.title}</h2>
                      <p>{property.city}</p>
                      <p>{formatPrice(property.price)}</p>
                      <p>{property.type} • {property.transaction}</p>
                      <p>{property.published ? "Publié" : "Brouillon"}</p>
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
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(price));
}