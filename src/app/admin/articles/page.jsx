
import Link from "next/link";
import Image from "next/image";
import AdminNav from "../../../../components/admin/AdminNav";
import { prisma } from "../../../../lib/prisma";
import ArticleDeleteButton from "../../../../components/admin/ArticleDeleteButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gestion des actualités | Florian Immo",
};

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
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
              <h1>Gestion des actualités</h1>
              <p>
                Retrouvez et gérez tous les articles
                publiés sur Florian Immo.
              </p>
            </div>

            <Link
              href="/admin/articles/nouveau"
              className="btn btn-gold"
            >
              + Ajouter un article
            </Link>
          </div>

          {articles.length === 0 ? (
            <div className="admin-empty-box">
              <h2>Aucun article enregistré</h2>
              <p>
                Commencez par créer votre première actualité.
              </p>

              <Link
                href="/admin/articles/nouveau"
                className="btn btn-gold"
              >
                Créer un article
              </Link>
            </div>
          ) : (
            <div className="admin-articles-list">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="admin-article-card"
                >
                  <div className="admin-article-image">
                    {article.coverImage ? (
                      <Image
                        src={article.coverImage}
                        alt={article.title}
                        fill
                        sizes="120px"
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    ) : (
                      <span>Florian Immo</span>
                    )}
                  </div>

                  <div className="admin-article-info">
                    <div className="admin-article-badges">
                      <span
                        className={
                          article.published
                            ? "article-badge published"
                            : "article-badge draft"
                        }
                      >
                        {article.published
                          ? "Publié"
                          : "Brouillon"}
                      </span>

                      {article.featured && (
                        <span className="article-badge featured">
                          À la une
                        </span>
                      )}
                    </div>

                    <h2>{article.title}</h2>

                    {article.excerpt && (
                      <p>{article.excerpt}</p>
                    )}

                    <small>
                      Créé le{" "}
                      {new Date(
                        article.createdAt
                      ).toLocaleDateString("fr-FR")}
                      {article.author && (
                        <> · Par {article.author}</>
                      )}
                    </small>
                  </div>

                  <div className="admin-article-actions">
                    <Link
                      href={`/actualites/${article.slug}`}
                      className="article-action view"
                      target="_blank"
                    >
                      Voir
                    </Link>

                    <Link
                      href={`/admin/articles/${article.id}/modifier`}
                      className="article-action edit"
                    >
                      Modifier
                    </Link>

                    <ArticleDeleteButton
                      id={article.id}
                      title={article.title}
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
