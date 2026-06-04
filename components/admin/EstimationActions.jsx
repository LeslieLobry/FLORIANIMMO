"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import "./admin.css"

export default function EstimationActions({ estimation }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const changerStatut = async (status) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/estimations/${estimation.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erreur");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erreur lors du changement de statut.");
    } finally {
      setLoading(false);
    }
  };

  const supprimer = async () => {
    const confirmation = confirm(
      "Supprimer définitivement cette demande d'estimation ?"
    );

    if (!confirmation) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/admin/estimations/${estimation.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erreur");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="estimation-actions-admin">
      <button
        type="button"
        onClick={() => changerStatut("A_FAIRE")}
        disabled={loading || estimation.status === "A_FAIRE"}
      >
        À faire
      </button>

      <button
        type="button"
        onClick={() => changerStatut("CONTACTE")}
        disabled={loading || estimation.status === "CONTACTE"}
      >
        Contacté
      </button>

      <button
        type="button"
        onClick={() => changerStatut("VISITE_PLANIFIEE")}
        disabled={loading || estimation.status === "VISITE_PLANIFIEE"}
      >
        Visite
      </button>

      <button
        type="button"
        onClick={() => changerStatut("TRAITE")}
        disabled={loading || estimation.status === "TRAITE"}
      >
        Traité
      </button>

      <button
        type="button"
        onClick={supprimer}
        disabled={loading}
        className="danger"
      >
        Supprimer
      </button>
    </div>
  );
}