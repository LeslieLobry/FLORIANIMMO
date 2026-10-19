
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function AdminNav() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      await signOut({
        callbackUrl: "/admin/login",
      });
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
      setLoading(false);
    }
  }

  return (
    <div className="admin-nav">
      <div className="container admin-nav-inner">
        <Link href="/admin" className="admin-nav-logo">
          Admin Florian Immo
        </Link>

        <nav className="admin-nav-links">
          <Link href="/admin">Dashboard</Link>

          <Link href="/admin/biens">Biens</Link>

          <Link href="/admin/biens/nouveau">
            Ajouter un bien
          </Link>

          <Link href="/admin/estimations">
            Estimations
          </Link>

          <Link href="/admin/articles">
            Articles
          </Link>

          <Link href="/admin/articles/nouveau">
            Ajouter un article
          </Link>

          <Link href="/admin/partenaires">
            Partenaires
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="btn btn-gold"
          >
            {loading ? "Déconnexion..." : "Déconnexion"}
          </button>
        </nav>
      </div>
    </div>
  );
}
