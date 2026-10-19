
import Link from "next/link";
import AdminNav from "../../../../../components/admin/AdminNav";
import ArticleForm from "../../../../../components/admin/ArticleForm";

export const metadata = {
  title: "Ajouter un article | Florian Immo",
};

export default function NewArticlePage() {
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
              <h1>Ajouter un article</h1>
              <p>
                Rédigez une nouvelle actualité
                immobilière.
              </p>
            </div>

            <Link
              href="/admin/articles"
              className="btn btn-outline"
            >
              Retour aux articles
            </Link>
          </div>

          <ArticleForm />
        </div>
      </section>
    </>
  );
}
