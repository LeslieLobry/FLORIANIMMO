import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      where: {
        published: true,
        status: {
          not: "ARCHIVE",
        },
      },
      include: {
        images: {
          orderBy: {
            position: "asc",
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ success: true, data: properties });
  } catch (error) {
    console.error("GET /api/biens error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur lors de la récupération des biens." },
      { status: 500 }
    );
  }
}