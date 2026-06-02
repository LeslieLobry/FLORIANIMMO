import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function GET(_, { params }) {
  try {
    const property = await prisma.property.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        images: {
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    if (!property || !property.published || property.status === "ARCHIVE") {
      return NextResponse.json(
        { success: false, message: "Bien introuvable." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    console.error("GET /api/biens/[slug] error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération du bien." },
      { status: 500 }
    );
  }
}