
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import ArticleForm from "@/components/admin/ArticleForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Modifier un article | Florian Immo",
};

export default async function ModifierArticlePage({ params }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
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
              <h1>Modifier un article</h1>
              <p>
                Modifiez les informations de votre actualité.
              </p>
            </div>

            <Link
              href="/admin/articles"
              className="btn btn-outline"
            >
              Retour aux actualités
            </Link>
          </div>

          <ArticleForm
            article={{
              id: article.id,
              title: article.title,
              excerpt: article.excerpt,
              content: article.content,
              author: article.author,
              coverImage: article.coverImage,
              published: article.published,
              featured: article.featured,
            }}
          />
        </div>
      </section>
    </>
  );
}
