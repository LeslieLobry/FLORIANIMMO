
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/admin/AdminNav";
import EditPropertyForm from "@/components/admin/EditPropertyForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Modifier un bien | Florian Immo",
};

export default async function EditPropertyPage({ params }) {
  // Vérification de la connexion administrateur
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const { id } = await params;

  // Récupération du bien et de ses photos
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: [
          { isPrimary: "desc" },
          { position: "asc" },
        ],
      },
    },
  });

  if (!property) {
    notFound();
  }

  // Préparation des données pour le formulaire client
  const initialProperty = {
    ...property,
    price: property.price.toString(),
    createdAt: property.createdAt.toISOString(),
    updatedAt: property.updatedAt.toISOString(),
    images: property.images.map((image) => ({
      ...image,
      createdAt: image.createdAt.toISOString(),
    })),
  };

  return (
    <>
      <AdminNav />

      <section className="admin-section">
        <div className="container">
          <div className="admin-page-head">
            <div>
              <span className="eyebrow">
                Administration
              </span>
              <h1>Modifier le bien</h1>
              <p className="admin-page-subtitle">
                Modifiez les caractéristiques,
                les surfaces, l'orientation et
                les photos de votre annonce.
              </p>
            </div>

            <Link
              href="/admin/biens"
              className="btn btn-outline"
            >
              Retour aux biens
            </Link>
          </div>

          <div className="admin-form-wrap">
            <EditPropertyForm property={initialProperty} />
          </div>
        </div>
      </section>
    </>
  );
}
