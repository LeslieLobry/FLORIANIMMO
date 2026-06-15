import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "ID manquant." }, { status: 400 });
    }

    const property = await prisma.property.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!property) {
      return NextResponse.json(
        { message: "Bien introuvable." },
        { status: 404 }
      );
    }

    await prisma.propertyImage.deleteMany({
      where: { propertyId: id },
    });

    await prisma.property.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Bien supprimé avec succès.",
    });
  } catch (error) {
    console.error("DELETE /api/admin/biens/[id]", error);

    return NextResponse.json(
      { message: "Erreur lors de la suppression du bien." },
      { status: 500 }
    );
  }
}

export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ message: "ID manquant." }, { status: 400 });
    }

    const property = await prisma.property.update({
      where: { id },
      data: {
        title: body.title,
        type: body.type,
        transaction: body.transaction,
        price: body.price ? Number(body.price) : null,
        city: body.city,
        postalCode: body.postalCode || null,
        surface: body.surface ? Number(body.surface) : null,
        rooms: body.rooms ? Number(body.rooms) : null,
        bedrooms: body.bedrooms ? Number(body.bedrooms) : null,
        bathrooms: body.bathrooms ? Number(body.bathrooms) : null,
        shortDesc: body.shortDesc || null,
        description: body.description || null,
        dpe: body.dpe || null,
        ges: body.ges || null,
        featured: Boolean(body.featured),
        published: Boolean(body.published),
        hasGarden: Boolean(body.hasGarden),
        hasGarage: Boolean(body.hasGarage),
        hasTerrace: Boolean(body.hasTerrace),
        hasElevator: Boolean(body.hasElevator),
      },
    });

    return NextResponse.json({
      message: "Bien modifié avec succès.",
      property,
    });
  } catch (error) {
    console.error("PUT /api/admin/biens/[id]", error);

    return NextResponse.json(
      { message: "Erreur lors de la modification du bien." },
      { status: 500 }
    );
  }
}