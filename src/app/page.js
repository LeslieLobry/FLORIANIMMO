import Hero from "../../components/Hero";
import FeaturedProperties from "../../components/FeaturedProperties";
import Services from "../../components/Services";
import ContactCta from "../../components/ContactCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <Services />
      <ContactCta />
    </>
  );
}