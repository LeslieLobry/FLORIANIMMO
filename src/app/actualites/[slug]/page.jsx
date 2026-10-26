
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import styles from "../publicPages.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (!article || !article.published) {
    return { title: "Article introuvable | Florian Immo" };
  }

  return {
    title: `${article.title} | Florian Immo`,
    description:
      article.excerpt || article.content.slice(0, 160),
  };
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
  });

  if (!article || !article.published) {
    notFound();
  }

  const date = article.publishedAt || article.createdAt;

  return (
    <main className={styles.page}>
      <article className={styles.articleDetail}>
        <div className={styles.articleContainer}>
          <Link href="/actualites" className={styles.backLink}>
            ← Retour aux actualités
          </Link>

          <header className={styles.articleHeader}>
            <span className={styles.eyebrow}>
              ACTUALITÉS IMMOBILIÈRES
            </span>

            <h1>{article.title}</h1>

            {article.excerpt && (
              <p className={styles.articleIntro}>
                {article.excerpt}
              </p>
            )}

            <div className={styles.articleMeta}>
              <time dateTime={new Date(date).toISOString()}>
                {new Date(date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>

              {article.author && (
                <span>Par {article.author}</span>
              )}
            </div>
          </header>

          {article.coverImage && (
            <img
              src={article.coverImage}
              alt={article.title}
              className={styles.detailImage}
            />
          )}

          <div className={styles.articleBody}>
            {article.content}
          </div>

          <div className={styles.articleFooter}>
            <h2>Un projet immobilier ?</h2>
            <p>
              Florian Immo vous accompagne dans vos projets
              de vente, d'achat et d'estimation.
            </p>
            <Link href="/contact" className={styles.goldButton}>
              Nous contacter
            </Link>
          </div>

          <Link href="/actualites" className={styles.backLink}>
            ← Voir toutes les actualités
          </Link>
        </div>
      </article>
    </main>
  );
}
