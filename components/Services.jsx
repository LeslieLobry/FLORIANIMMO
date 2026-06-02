export default function Services() {
  const services = [
    {
      title: "Achat immobilier",
      text: "Un accompagnement clair pour trouver un bien adapté à votre budget et à votre projet.",
    },
    {
      title: "Vente immobilière",
      text: "Une mise en valeur sérieuse de votre bien pour vendre dans de bonnes conditions.",
    },
    {
      title: "Estimation",
      text: "Une estimation cohérente avec le marché local et les caractéristiques du bien.",
    },
  ];

  return (
    <section className="section section-light">
      <div className="container">
        <div className="section-head center">
          <div>
            <span className="eyebrow">Services</span>
            <h2>Un accompagnement complet</h2>
          </div>
        </div>

        <div className="service-grid">
          {services.map((service) => (
            <div className="service-card" key={service.title}>
              <h3>{service.title}</h3>
              <p>{service.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}