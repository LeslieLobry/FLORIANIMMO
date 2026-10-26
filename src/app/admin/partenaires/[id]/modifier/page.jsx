
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNav from "@/components/admin/AdminNav";
import PartnerForm from "@/components/admin/PartnerForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Modifier un partenaire | Florian Immo",
};

export default async function ModifierPartenairePage({
  params,
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const { id } = await params;

  const partner = await prisma.partner.findUnique({
    where: { id },
  });

  if (!partner) {
    notFound();
  }

  return (
    <>
      <AdminNav />

      <section className="admin-section">
        <div className="container">
          <div className="admin-page-head">
            <div>
              <span className="eyebrow">
                Administration / Partenaires
              </span>
              <h1>Modifier un partenaire</h1>
              <p>
                Modifiez ses informations,
                son logo ou sa visibilité.
              </p>
            </div>

            <Link
              href="/admin/partenaires"
              className="btn btn-outline"
            >
              Retour aux partenaires
            </Link>
          </div>

          <PartnerForm
            partner={{
              id: partner.id,
              name: partner.name,
              description: partner.description,
              logo: partner.logo,
              website: partner.website,
              position: partner.position,
              published: partner.published,
            }}
          />
        </div>
      </section>
    </>
  );
}
