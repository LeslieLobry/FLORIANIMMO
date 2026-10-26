
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import PartnerDeleteButton from "@/components/admin/PartnerDeleteButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gestion des partenaires | Florian Immo",
};

export default async function AdminPartenairesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const partners = await prisma.partner.findMany({
    orderBy: [
      { position: "asc" },
      { name: "asc" },
    ],
  });

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
              <h1>Gestion des partenaires</h1>
              <p>
                Gérez les entreprises et professionnels
                qui font confiance à Florian Immo.
              </p>
            </div>

            <Link
              href="/admin/partenaires/nouveau"
              className="btn btn-gold"
            >
              + Ajouter un partenaire
            </Link>
          </div>

          {partners.length === 0 ? (
            <div className="admin-empty-box">
              <h2>Aucun partenaire enregistré</h2>
              <p>
                Ajoutez votre premier partenaire
                pour le présenter sur votre site.
              </p>
              <Link
                href="/admin/partenaires/nouveau"
                className="btn btn-gold"
              >
                Ajouter un partenaire
              </Link>
            </div>
          ) : (
            <div className="admin-articles-list">
              {partners.map((partner) => (
                <article
                  key={partner.id}
                  className="admin-article-card"
                >
                  <div className="admin-article-image">
                    {partner.logo ? (
                      <img
                        src={partner.logo}
                        alt={`Logo ${partner.name}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    ) : (
                      <span>Florian Immo</span>
                    )}
                  </div>

                  <div className="admin-article-info">
                    <div className="admin-article-badges">
                      <span
                        className={
                          partner.published
                            ? "article-badge published"
                            : "article-badge draft"
                        }
                      >
                        {partner.published
                          ? "Publié"
                          : "Masqué"}
                      </span>
                      <span className="article-badge featured">
                        Position {partner.position}
                      </span>
                    </div>

                    <h2>{partner.name}</h2>

                    {partner.description && (
                      <p>{partner.description}</p>
                    )}

                    {partner.website && (
                      <small>{partner.website}</small>
                    )}
                  </div>

                  <div className="admin-article-actions">
                    <Link
                      href={`/admin/partenaires/${partner.id}/modifier`}
                      className="article-action edit"
                    >
                      Modifier
                    </Link>

                    <PartnerDeleteButton
                      id={partner.id}
                      name={partner.name}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
