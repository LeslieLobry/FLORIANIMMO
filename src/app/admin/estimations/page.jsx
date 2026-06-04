import AdminNav from "../../../../components/admin/AdminNav";
import EstimationActions from "../../../../components/admin/EstimationActions";
import { prisma } from "../../../../lib/prisma";

export const metadata = {
  title: "Admin Estimations | Florian Immo",
};

const statusLabels = {
  A_FAIRE: "À faire",
  CONTACTE: "Contacté",
  VISITE_PLANIFIEE: "Visite planifiée",
  TRAITE: "Traité",
};

export default async function AdminEstimationsPage() {
  const estimations = await prisma.estimationRequest.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = estimations.length;
  const aFaire = estimations.filter((e) => e.status === "A_FAIRE").length;
  const contacte = estimations.filter((e) => e.status === "CONTACTE").length;
  const visite = estimations.filter(
    (e) => e.status === "VISITE_PLANIFIEE"
  ).length;
  const traite = estimations.filter((e) => e.status === "TRAITE").length;

  return (
    <>
      <AdminNav />

      <main className="admin-section">
        <div className="container">
          <div className="admin-page-head">
            <div>
              <span className="eyebrow">Administration</span>
              <h1>Demandes d&apos;estimation</h1>
            </div>
          </div>

          <div className="estimation-stats">
            <div>
              <span>Total</span>
              <strong>{total}</strong>
            </div>
            <div>
              <span>À faire</span>
              <strong>{aFaire}</strong>
            </div>
            <div>
              <span>Contactés</span>
              <strong>{contacte}</strong>
            </div>
            <div>
              <span>Visites</span>
              <strong>{visite}</strong>
            </div>
            <div>
              <span>Traités</span>
              <strong>{traite}</strong>
            </div>
          </div>

          {estimations.length === 0 ? (
            <div className="admin-empty-box">
              <h2>Aucune demande d&apos;estimation</h2>
              <p>Les demandes envoyées depuis le formulaire apparaîtront ici.</p>
            </div>
          ) : (
            <div className="estimation-list">
              {estimations.map((estimation) => (
                <article key={estimation.id} className="estimation-card-admin">
                  <div className="estimation-card-head">
                    <div>
                      <span
                        className={`status-badge status-${estimation.status}`}
                      >
                        {statusLabels[estimation.status] || estimation.status}
                      </span>

                      <h2>
                        {estimation.prenom} {estimation.nom}
                      </h2>

                      <p>
                        Demande reçue le{" "}
                        {new Date(estimation.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>

                      {estimation.lastContactAt && (
                        <p>
                          Dernier contact :{" "}
                          {new Date(
                            estimation.lastContactAt
                          ).toLocaleDateString("fr-FR")}
                        </p>
                      )}
                    </div>

                    <div className="estimation-contact-links">
                      <a href={`mailto:${estimation.email}`}>
                        {estimation.email}
                      </a>
                      <a href={`tel:${estimation.telephone}`}>
                        {estimation.telephone}
                      </a>
                    </div>
                  </div>

                  <div className="estimation-details-grid">
                    <div>
                      <h3>Bien</h3>
                      <p>
                        <strong>{estimation.typeBien}</strong>
                      </p>
                      <p>{estimation.adresse}</p>
                      <p>
                        {estimation.codePostal} {estimation.ville}
                      </p>
                    </div>

                    <div>
                      <h3>Surfaces</h3>
                      <p>
                        Habitable :{" "}
                        <strong>
                          {estimation.surfaceHabitable
                            ? `${estimation.surfaceHabitable} m²`
                            : "Non renseigné"}
                        </strong>
                      </p>
                      <p>
                        Terrain :{" "}
                        <strong>
                          {estimation.surfaceTerrain
                            ? `${estimation.surfaceTerrain} m²`
                            : "Non renseigné"}
                        </strong>
                      </p>
                    </div>

                    <div>
                      <h3>Caractéristiques</h3>
                      <p>Pièces : {estimation.nbPieces || "Non renseigné"}</p>
                      <p>Chambres : {estimation.chambres || "Non renseigné"}</p>
                      <p>
                        Année :{" "}
                        {estimation.anneeConstruction || "Non renseignée"}
                      </p>
                      <p>DPE : {estimation.dpe || "Non renseigné"}</p>
                    </div>

                    <div>
                      <h3>État</h3>
                      <p>{estimation.etatBien || "Non renseigné"}</p>
                      <p>
                        Chauffage : {estimation.chauffage || "Non renseigné"}
                      </p>
                    </div>
                  </div>

                  {estimation.informations && (
                    <div className="estimation-info-admin">
                      <h3>Informations complémentaires</h3>
                      <p>{estimation.informations}</p>
                    </div>
                  )}

                  <EstimationActions estimation={estimation} />
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}