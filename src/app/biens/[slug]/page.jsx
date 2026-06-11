import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import PropertyGallery from "../../../../components/PropertyGallery";
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const property = await prisma.property.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
  });

  if (!property) {
    return { title: "Bien introuvable | Florian Immo" };
  }

  return {
    title: `${property.title} | Florian Immo`,
    description:
      property.shortDesc ||
      property.description?.slice(0, 160) ||
      "Découvrez ce bien immobilier proposé par Florian Immo.",
  };
}

export default async function PropertyDetailPage({ params }) {
  const { slug } = await params;

  const property = await prisma.property.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
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
    <main className="property-detail-page">
      <section className="property-detail-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link href="/">Accueil</Link>
            <span>/</span>
            <Link href="/biens">Biens</Link>
            <span>/</span>
            <span>{property.title}</span>
          </div>

          <div className="property-detail-hero-grid">
            <div>
              <span className="property-status-badge">
                {formatTransaction(property.transaction)}
              </span>

              <h1>{property.title}</h1>

              <p className="property-location">
                {property.city || "Ville non précisée"}
                {property.postalCode ? ` (${property.postalCode})` : ""}
              </p>
            </div>

            <div className="property-price-box">
              <span>Prix</span>
              <strong>{formatPrice(property.price)}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="property-detail-content">
        <div className="container">
        <div className="property-main-image">
  <PropertyGallery images={property.images} />
</div>
          <div className="property-detail-layout">
            <div className="property-detail-left">
              <div className="property-features-grid">
                <div>
                  <span>Surface</span>
                  <strong>
                    {property.surface ? `${property.surface} m²` : "NC"}
                  </strong>
                </div>

                <div>
                  <span>Pièces</span>
                  <strong>{property.rooms || "NC"}</strong>
                </div>

                <div>
                  <span>Chambres</span>
                  <strong>{property.bedrooms || "NC"}</strong>
                </div>

                <div>
                  <span>Type</span>
                  <strong>{formatValue(property.type)}</strong>
                </div>
              </div>

              <div className="property-description-block">
                <span className="eyebrow">Description</span>
                <h2>À propos de ce bien</h2>

                <p>
                  {property.description || "Description bientôt disponible."}
                </p>
              </div>

              <div className="property-info-block">
                <h2>Caractéristiques</h2>

                <div className="property-info-list">
                  <div>
                    <span>Transaction</span>
                    <strong>{formatTransaction(property.transaction)}</strong>
                  </div>

                  <div>
                    <span>Statut</span>
                    <strong>{formatValue(property.status)}</strong>
                  </div>

                  <div>
                    <span>Surface</span>
                    <strong>
                      {property.surface ? `${property.surface} m²` : "Non précisée"}
                    </strong>
                  </div>

                  <div>
                    <span>Pièces</span>
                    <strong>{property.rooms || "Non précisé"}</strong>
                  </div>

                  <div>
                    <span>Chambres</span>
                    <strong>{property.bedrooms || "Non précisé"}</strong>
                  </div>

                  <div>
                    <span>Salles de bain</span>
                    <strong>{property.bathrooms || "Non précisé"}</strong>
                  </div>

                  <div>
                    <span>DPE</span>
                    <strong>{property.dpe || "Non précisé"}</strong>
                  </div>

                  <div>
                    <span>GES</span>
                    <strong>{property.ges || "Non précisé"}</strong>
                  </div>
                </div>
              </div>
            </div>

            <aside className="property-contact-card">
              <span className="eyebrow">Intéressé par ce bien ?</span>

              <h2>Contactez Florian</h2>

              <p>
                Vous souhaitez visiter ce bien ou obtenir plus d’informations ?
                Florian vous accompagne dans votre projet immobilier.
              </p>

              <div className="property-contact-actions">
                <Link href="/contact" className="btn btn-gold">
                  Contacter l’agence
                </Link>

                <Link
                  href={`/rendez-vous?property=${property.slug || property.id}`}
                  className="btn btn-outline"
                >
                  Prendre rendez-vous
                </Link>
              </div>

              <div className="property-contact-note">
                Réponse rapide et accompagnement personnalisé.
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function formatPrice(price) {
  if (!price) return "Prix sur demande";

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(price));
}

function formatTransaction(transaction) {
  if (!transaction) return "Bien disponible";
  if (transaction === "VENTE") return "À vendre";
  if (transaction === "LOCATION") return "À louer";
  return transaction;
}

function formatValue(value) {
  if (!value) return "Non précisé";
  return String(value).replaceAll("_", " ");
}