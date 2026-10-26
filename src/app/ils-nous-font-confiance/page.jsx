
import { prisma } from "../../../lib/prisma";
import styles from "../actualites/publicPages.module.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Ils nous font confiance | Florian Immo",
  description:
    "Découvrez les partenaires qui font confiance à Florian Immo.",
};

export default async function PartenairesPage() {
  const partners = await prisma.partner.findMany({
    where: { published: true },
    orderBy: [
      { position: "asc" },
      { name: "asc" },
    ],
  });

  function safeWebsite(website) {
    if (!website) return null;

    try {
      const url = new URL(
        /^https?:\/\//i.test(website)
          ? website
          : `https://${website}`
      );

      return ["http:", "https:"].includes(url.protocol)
        ? url.href
        : null;
    } catch {
      return null;
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>FLORIAN IMMO</span>
          <h1>Ils nous font confiance</h1>
          <p>
            Des partenaires de confiance qui partagent
            nos valeurs de professionnalisme, de proximité
            et de qualité.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>
              NOTRE RÉSEAU
            </span>
            <h2>Nos partenaires</h2>
            <p>
              Ensemble, nous construisons des relations
              durables au service de vos projets.
            </p>
          </div>

          {partners.length === 0 ? (
            <div className={styles.empty}>
              <h2>Nos partenaires arrivent bientôt</h2>
              <p>
                Retrouvez prochainement les professionnels
                qui nous accompagnent.
              </p>
            </div>
          ) : (
            <div className={styles.partnerGrid}>
              {partners.map((partner) => {
                const website = safeWebsite(partner.website);

                return (
                  <div
                    key={partner.id}
                    className={styles.partnerCard}
                  >
                    <div className={styles.partnerLogo}>
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={`Logo ${partner.name}`}
                        />
                      ) : (
                        <span>{partner.name}</span>
                      )}
                    </div>

                    <h3>{partner.name}</h3>

                    {partner.description && (
                      <p>{partner.description}</p>
                    )}

                    {website && (
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.readMore}
                      >
                        Découvrir le partenaire
                        <span aria-hidden="true"> →</span>
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
