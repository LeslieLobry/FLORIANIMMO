import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";

const STATUTS_AUTORISES = [
  "A_FAIRE",
  "CONTACTE",
  "VISITE_PLANIFIEE",
  "TRAITE",
];

export async function PATCH(req, { params }) {
  try {
    const id = Number(params.id);
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID invalide." },
        { status: 400 }
      );
    }

    if (!STATUTS_AUTORISES.includes(body.status)) {
      return NextResponse.json(
        { success: false, message: "Statut invalide." },
        { status: 400 }
      );
    }

    const estimation = await prisma.estimationRequest.update({
      where: { id },
      data: {
        status: body.status,
        lastContactAt:
          body.status === "CONTACTE" ||
          body.status === "VISITE_PLANIFIEE" ||
          body.status === "TRAITE"
            ? new Date()
            : undefined,
      },
    });

    return NextResponse.json({ success: true, estimation });
  } catch (error) {
    console.error("Erreur PATCH estimation :", error);

    return NextResponse.json(
      { success: false, message: "Erreur lors de la modification." },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID invalide." },
        { status: 400 }
      );
    }

    await prisma.estimationRequest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur DELETE estimation :", error);

    return NextResponse.json(
      { success: false, message: "Erreur lors de la suppression." },
      { status: 500 }
    );
  }
}