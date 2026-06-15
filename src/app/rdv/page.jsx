import RendezVousForm from "../../../components/RendezVousForm";

export const metadata = {
  title: "Prendre rendez-vous | Florian Immo",
};

export default function RendezVousPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="page-head">
          <span className="eyebrow">Rendez-vous</span>
          <h1>Prendre rendez-vous</h1>
          <p>
            Remplissez le formulaire ci-dessous. L’agence vous recontactera
            rapidement pour confirmer le rendez-vous.
          </p>
        </div>

        <RendezVousForm />
      </div>
    </main>
  );
}