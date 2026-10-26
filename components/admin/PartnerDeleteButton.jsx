
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PartnerDeleteButton({ id, name }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le partenaire "${name}" ?`
    );

    if (!confirmed || loading) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/partenaires/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || "Impossible de supprimer le partenaire."
        );
      }

      router.refresh();
    } catch (error) {
      window.alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className="article-action delete"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "Suppression..." : "Supprimer"}
    </button>
  );
}
