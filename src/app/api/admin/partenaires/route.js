
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import {
  parsePartnerForm,
  uploadPartnerLogo,
} from "@/lib/partnerHelpers";

export const runtime = "nodejs";

// AJOUTER UN PARTENAIRE
export async function POST(request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Non autorisé." },
      { status: 401 }
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
    const logo = await uploadPartnerLogo(
      formData.get("image")
    );

    const partner = await prisma.partner.create({
      data: {
        ...data,
        logo,
      },
    });

    return NextResponse.json(
      {
        success: true,
        partner,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur création partenaire :", error);

    return NextResponse.json(
      {
        error: "Impossible d'enregistrer le partenaire ou son logo.",
      },
      { status: 500 }
    );
  }
}
