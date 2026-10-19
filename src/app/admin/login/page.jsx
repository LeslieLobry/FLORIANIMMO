
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Email ou mot de passe incorrect.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className="section"
      style={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="container"
        style={{ width: "100%", maxWidth: "520px" }}
      >
        <div className="premium-section">
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <span className="eyebrow">Espace privé</span>
            <h1>Florian Immo</h1>
            <p>Connexion à l'administration</p>
          </div>

          <form
            className="admin-form premium-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-field">
              <label htmlFor="email">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="Votre adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="admin-field">
              <label htmlFor="password">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-gold"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading
                ? "Connexion en cours..."
                : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
