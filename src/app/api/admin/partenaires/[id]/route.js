
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  parsePartnerForm,
  uploadPartnerLogo,
} from "@/lib/partnerHelpers";

export const runtime = "nodejs";

async function isAdmin() {
  const session = await auth();

  return Boolean(
    session?.user && session.user.role === "ADMIN"
  );
}

// MODIFIER UN PARTENAIRE
export async function PATCH(request, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Non autorisé." },
      { status: 401 }
    );
  }

  const { id } = await params;

  const existing = await prisma.partner.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Partenaire introuvable." },
      { status: 404 }
    );
  }

  let formData;
  let data;

  try {
    formData = await request.formData();
    data = parsePartnerForm(formData);
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  try {
    let logo = existing.logo;

    const image = formData.get("image");
    const removeLogo =
      formData.get("removeLogo") === "true";

    if (removeLogo) {
      logo = null;
    }

    if (image && typeof image !== "string" && image.size > 0) {
      logo = await uploadPartnerLogo(image);
    }

    const partner = await prisma.partner.update({
      where: { id },
      data: {
        ...data,
        logo,
      },
    });

    return NextResponse.json({
      success: true,
      partner,
    });
  } catch (error) {
    console.error("Erreur modification partenaire :", error);

    return NextResponse.json(
      {
        error: "Impossible de modifier le partenaire.",
      },
      { status: 500 }
    );
  }
}

// SUPPRIMER UN PARTENAIRE
export async function DELETE(request, { params }) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Non autorisé." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    const existing = await prisma.partner.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Partenaire introuvable." },
        { status: 404 }
      );
    }

    await prisma.partner.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Partenaire supprimé.",
    });
  } catch (error) {
    console.error("Erreur suppression partenaire :", error);

    return NextResponse.json(
      {
        error: "Impossible de supprimer le partenaire.",
      },
      { status: 500 }
    );
  }
}
