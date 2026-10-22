
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const proxy = auth((req) => {
  const pathname = req.nextUrl.pathname;

  const connected = req.auth?.user?.role === "ADMIN";

  // Autoriser l'accès à la connexion
  if (pathname === "/admin/login") {
    if (connected) {
      return NextResponse.redirect(
        new URL("/admin", req.url)
      );
    }

    return NextResponse.next();
  }

  // Protéger les API d'administration
  if (pathname.startsWith("/api/admin") && !connected) {
    return NextResponse.json(
      { message: "Accès non autorisé" },
      { status: 401 }
    );
  }

  // Protéger toutes les pages d'administration
  if (pathname.startsWith("/admin") && !connected) {
    return NextResponse.redirect(
      new URL("/admin/login", req.url)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
