import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo">
          Florian Immo
        </Link>

        <nav className="main-nav">
          <Link href="/">Accueil</Link>
          <Link href="/biens">Biens</Link>
          <Link href="/rdv">Rendez-vous</Link>
          <Link href="/estimation">Estimation</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <Link href="/contact" className="btn btn-gold">
          Prendre contact
        </Link>
      </div>
    </header>
  );
}