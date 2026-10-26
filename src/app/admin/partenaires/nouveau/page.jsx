
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import PartnerForm from "@/components/admin/PartnerForm";

export const metadata = {
  title: "Ajouter un partenaire | Florian Immo",
};

export default async function NouveauPartenairePage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
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
              <h1>Ajouter un partenaire</h1>
              <p>
                Ajoutez un professionnel ou une entreprise
                au réseau Florian Immo.
              </p>
            </div>

            <Link
              href="/admin/partenaires"
              className="btn btn-outline"
            >
              Retour aux partenaires
            </Link>
          </div>

          <PartnerForm />
        </div>
      </section>
    </>
  );
}
