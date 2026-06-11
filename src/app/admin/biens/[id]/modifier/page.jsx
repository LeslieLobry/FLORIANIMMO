import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNav from "../../../../../../components/admin/AdminNav";
import EditPropertyForm from "../../../../../../components/admin/EditPropertyForm";
import { prisma } from "../../../../../../lib/prisma";

export const metadata = {
  title: "Modifier un bien | Florian Immo",
};

export default async function EditPropertyPage({ params }) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: [{ isPrimary: "desc" }, { position: "asc" }],
      },
    },
  });

  if (!property) {
    notFound();
  }

  return (
    <>
      <AdminNav />

      <section className="admin-section">
        <div className="container">
          <div className="admin-page-head">
            <div>
              <span className="eyebrow">Administration</span>
              <h1>Modifier le bien</h1>
            </div>

            <Link href="/admin/biens" className="btn btn-outline">
              Retour aux biens
            </Link>
          </div>

          <div className="admin-form-wrap">
            <EditPropertyForm property={property} />
          </div>
        </div>
      </section>
    </>
  );
}