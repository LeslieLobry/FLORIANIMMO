
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/biens", label: "Biens" },
  // { href: "/rdv", label: "Rendez-vous" },
  { href: "/estimation", label: "Estimation" },
  { href: "/actualites", label: "Actualités" },
  {
    href: "/ils-nous-font-confiance",
    label: "Ils nous font confiance",
  },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link
          href="/"
          className="fi-header-brand"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/uploads/IAD.png"
            alt="Logo iad immobilier"
            width={90}
            height={56}
            className="fi-header-logo"
            priority
          />

          <span className="fi-header-identity">
            <strong>Florian Lobry</strong>
            <small>Conseiller immobilier iad</small>
          </span>
        </Link>

        <button
          className="fi-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          aria-controls="fi-navigation"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span>{menuOpen ? "✕" : "☰"}</span>
        </button>

        <nav
          id="fi-navigation"
          className={`fi-header-nav ${menuOpen ? "is-open" : ""}`}
          aria-label="Navigation principale"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href ? "is-active" : ""
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/contact"
            className="fi-mobile-contact"
            onClick={() => setMenuOpen(false)}
          >
            Prendre contact
          </Link>
        </nav>

        <Link href="/contact" className="fi-header-contact">
          Prendre contact
        </Link>
      </div>
    </header>
  );
}
