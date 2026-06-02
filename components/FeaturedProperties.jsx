import Link from "next/link";

const fakeProperties = [
  {
    id: 1,
    title: "Maison familiale avec jardin",
    city: "Roubaix",
    price: "265 000 €",
    surface: "120 m²",
    rooms: "5 pièces",
  },
  {
    id: 2,
    title: "Appartement lumineux centre-ville",
    city: "Lille",
    price: "189 000 €",
    surface: "74 m²",
    rooms: "3 pièces",
  },
  {
    id: 3,
    title: "Loft rénové avec terrasse",
    city: "Tourcoing",
    price: "319 000 €",
    surface: "142 m²",
    rooms: "4 pièces",
  },
];

export default function FeaturedProperties() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Sélection</span>
            <h2>Biens mis en avant</h2>
          </div>

          <Link href="/biens" className="simple-link">
            Voir tous les biens
          </Link>
        </div>

        <div className="property-grid">
          {fakeProperties.map((property) => (
            <article className="property-card" key={property.id}>
              <div className="property-image-placeholder" />
              <div className="property-content">
                <p className="property-city">{property.city}</p>
                <h3>{property.title}</h3>
                <p className="property-meta">
                  {property.surface} • {property.rooms}
                </p>
                <div className="property-bottom">
                  <strong>{property.price}</strong>
                  <Link href="/contact" className="btn btn-small">
                    Demander
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}