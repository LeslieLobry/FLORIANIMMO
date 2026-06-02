import Link from "next/link";
import AdminNav from "../../../components/admin/AdminNav";
import { prisma } from "../../../lib/prisma";

export const metadata = {
  title: "Admin Biens | Florian Immo",
};

export default async function AdminPropertiesPage() {
  const properties = await prisma.property.findMany({
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
              <p>
                Le client pourra ajouter ses biens ici au fur et à mesure.
              </p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Ville</th>
                    <th>Prix</th>
                    <th>Type</th>
                    <th>Transaction</th>
                    <th>Publié</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr key={property.id}>
                      <td>{property.title}</td>
                      <td>{property.city}</td>
                      <td>{formatPrice(property.price)}</td>
                      <td>{property.type}</td>
                      <td>{property.transaction}</td>
                      <td>{property.published ? "Oui" : "Non"}</td>
                      <td>{property.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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