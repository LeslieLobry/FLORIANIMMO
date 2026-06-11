"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePropertyButton({ propertyId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "Supprimer définitivement ce bien ? Cette action est irréversible."
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/biens/${propertyId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Erreur lors de la suppression.");
      }

      router.refresh();
    } catch (error) {
      alert(error.message || "Impossible de supprimer ce bien.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      className="btn admin-delete-btn"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? "Suppression..." : "Supprimer"}
    </button>
  );
}