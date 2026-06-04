import Link from "next/link";

export default function AdminNav() {
  return (
    <div className="admin-nav">
      <div className="container admin-nav-inner">
        <Link href="/admin" className="admin-nav-logo">
          Admin Florian Immo
        </Link>

        <nav className="admin-nav-links">
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/biens">Biens</Link>
          <Link href="/admin/biens/nouveau">Ajouter un bien</Link>
          <Link href="/admin/estimations">Estimations</Link>
        </nav>
      </div>
    </div>
  );
}