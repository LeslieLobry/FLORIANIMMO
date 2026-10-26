
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ArticleDeleteButton({ id, title }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmation = window.confirm(
      `Voulez-vous vraiment supprimer l'article "${title}" ?`
    );

    if (!confirmation) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/articles/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.error || "Impossible de supprimer l'article."
        );
      }

      router.refresh();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="article-action delete"
    >
      {loading ? "Suppression..." : "Supprimer"}
    </button>
  );
}
