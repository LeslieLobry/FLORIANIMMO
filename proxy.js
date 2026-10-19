
import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const proxy = auth((request) => {
  const pathname = request.nextUrl.pathname;

  const isAuthenticated =
    request.auth?.user?.role === "ADMIN";

  // Laisser la page de connexion accessible
  if (pathname === "/admin/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(
        new URL("/admin", request.url)
      );
    }

    return NextResponse.next();
  }

  // Refuser l'accès aux API sans connexion
  if (
    pathname.startsWith("/api/admin") &&
    !isAuthenticated
  ) {
    return NextResponse.json(
      { message: "Accès non autorisé." },
      { status: 401 }
    );
  }

  // Rediriger vers la connexion si nécessaire
  if (
    pathname.startsWith("/admin") &&
    !isAuthenticated
  ) {
    return NextResponse.redirect(
      new URL("/admin/login", request.url)
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
