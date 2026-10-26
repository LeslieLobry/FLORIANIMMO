
import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import styles from "./publicPages.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Actualités | Florian Immo",
  description:
    "Retrouvez les actualités, conseils et informations immobilières de Florian Immo.",
};

export default async function ActualitesPage() {
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: [
      { featured: "desc" },
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>FLORIAN IMMO</span>
          <h1>Nos actualités</h1>
          <p>
            Conseils, tendances et actualités du marché
            immobilier pour vous accompagner dans vos projets.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>LE BLOG</span>
            <h2>À la une</h2>
            <p>Découvrez nos dernières publications.</p>
          </div>

          {articles.length === 0 ? (
            <div className={styles.empty}>
              <h2>Les actualités arrivent bientôt</h2>
              <p>
                Revenez prochainement découvrir nos conseils
                et nos dernières actualités immobilières.
              </p>
            </div>
          ) : (
            <div className={styles.grid}>
              {articles.map((article) => (
                <article
                  key={article.id}
                  className={styles.articleCard}
                >
                  <Link
                    href={`/actualites/${article.slug}`}
                    className={styles.imageLink}
                  >
                    {article.coverImage ? (
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className={styles.coverImage}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>
                        FLORIAN IMMO
                      </div>
                    )}
                  </Link>

                  <div className={styles.cardContent}>
                    <div className={styles.cardMeta}>
                      {article.publishedAt && (
                        <time
                          dateTime={new Date(
                            article.publishedAt
                          ).toISOString()}
                        >
                          {new Date(
                            article.publishedAt
                          ).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </time>
                      )}
                      {article.featured && (
                        <span className={styles.featured}>
                          À LA UNE
                        </span>
                      )}
                    </div>

                    <h3>
                      <Link href={`/actualites/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h3>

                    <p>
                      {article.excerpt ||
                        article.content.slice(0, 160) + "..."}
                    </p>

                    <Link
                      href={`/actualites/${article.slug}`}
                      className={styles.readMore}
                    >
                      Lire l'article <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
