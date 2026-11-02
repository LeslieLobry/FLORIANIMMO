
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const VALID_STATUSES = [
  "DISPONIBLE",
  "SOUS_OFFRE",
  "VENDU",
  "LOUE",
  "ARCHIVE",
];

async function checkAdmin() {
  const session = await auth();

  return Boolean(
    session?.user && session.user.role === "ADMIN"
  );
}

function optionalNumber(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    throw new Error("Une valeur numérique est invalide.");
  }

  return number;
}

function optionalInteger(value) {
  const number = optionalNumber(value);

  if (number !== null && !Number.isInteger(number)) {
    throw new Error("Une valeur entière est invalide.");
  }

  return number;
}

// SUPPRESSION D'UN BIEN
export async function DELETE(req, context) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json(
        { message: "Accès non autorisé." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "ID manquant." },
        { status: 400 }
      );
    }

    const property = await prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      return NextResponse.json(
        { message: "Bien introuvable." },
        { status: 404 }
      );
    }

    // La relation PropertyImage est en onDelete: Cascade.
    // La suppression du bien retire donc aussi ses images
    // de la base de données.
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

// MODIFICATION D'UN BIEN ET DE SES PHOTOS
export async function PUT(req, context) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json(
        { message: "Accès non autorisé." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "ID manquant." },
        { status: 400 }
      );
    }

    const body = await req.json();

    const existingProperty = await prisma.property.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existingProperty) {
      return NextResponse.json(
        { message: "Bien introuvable." },
        { status: 404 }
      );
    }

    // VÉRIFICATION DU STATUT
    if (
      body.status !== undefined &&
      !VALID_STATUSES.includes(body.status)
    ) {
      return NextResponse.json(
        { message: "Statut du bien invalide." },
        { status: 400 }
      );
    }

    // DONNÉES DES PHOTOS
    const imagesToDelete = body.imagesToDelete ?? [];
    const newImages = body.newImages ?? [];
    const primaryImageId = body.primaryImageId ?? null;
    const primaryNewImageIndex =
      body.primaryNewImageIndex ?? null;

    if (
      !Array.isArray(imagesToDelete) ||
      !Array.isArray(newImages) ||
      imagesToDelete.some(
        (imageId) => typeof imageId !== "string"
      ) ||
      newImages.some(
        (image) =>
          !image ||
          typeof image.url !== "string" ||
          !image.url.startsWith(
            "https://res.cloudinary.com/"
          )
      )
    ) {
      return NextResponse.json(
        { message: "Données des photos invalides." },
        { status: 400 }
      );
    }

    // CONTRÔLER LES PHOTOS EXISTANTES
    const existingIds = new Set(
      existingProperty.images.map((image) => image.id)
    );

    if (
      imagesToDelete.some(
        (imageId) => !existingIds.has(imageId)
      )
    ) {
      return NextResponse.json(
        { message: "Une photo à supprimer est introuvable." },
        { status: 400 }
      );
    }

    if (
      primaryImageId !== null &&
      (!existingIds.has(primaryImageId) ||
        imagesToDelete.includes(primaryImageId))
    ) {
      return NextResponse.json(
        { message: "Photo principale invalide." },
        { status: 400 }
      );
    }

    if (
      primaryNewImageIndex !== null &&
      (!Number.isInteger(primaryNewImageIndex) ||
        primaryNewImageIndex < 0 ||
        primaryNewImageIndex >= newImages.length)
    ) {
      return NextResponse.json(
        { message: "Nouvelle photo principale invalide." },
        { status: 400 }
      );
    }

    if (
      primaryImageId !== null &&
      primaryNewImageIndex !== null
    ) {
      return NextResponse.json(
        {
          message:
            "Une seule photo principale peut être sélectionnée.",
        },
        { status: 400 }
      );
    }

    // PRÉPARER LES VALEURS NUMÉRIQUES
    let numericData;

    try {
      numericData = {
        price: optionalNumber(body.price),
        surface: optionalNumber(body.surface),
        landSurface: optionalNumber(body.landSurface),
        rooms: optionalInteger(body.rooms),
        bedrooms: optionalInteger(body.bedrooms),
        bathrooms: optionalInteger(body.bathrooms),
      };
    } catch (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    if (
      numericData.price === null ||
      numericData.price < 0 ||
      !body.title?.trim() ||
      !body.city?.trim()
    ) {
      return NextResponse.json(
        {
          message:
            "Le titre, la ville et un prix valide sont obligatoires.",
        },
        { status: 400 }
      );
    }

    // ENREGISTREMENT ATOMIQUE
    const updatedProperty = await prisma.$transaction(
      async (tx) => {
        // 1. MODIFIER LES CARACTÉRISTIQUES
        await tx.property.update({
          where: { id },
          data: {
            title: body.title,
            type: body.type,
            transaction: body.transaction,
            status:
              body.status ?? existingProperty.status,

            price: numericData.price,
            city: body.city,
            postalCode: body.postalCode || null,

            surface: numericData.surface,
            landSurface: numericData.landSurface,
            orientation: body.orientation || null,

            rooms: numericData.rooms,
            bedrooms: numericData.bedrooms,
            bathrooms: numericData.bathrooms,

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

        // 2. SUPPRIMER LES PHOTOS SÉLECTIONNÉES
        if (imagesToDelete.length > 0) {
          await tx.propertyImage.deleteMany({
            where: {
              propertyId: id,
              id: { in: imagesToDelete },
            },
          });
        }

        // 3. AJOUTER LES NOUVELLES PHOTOS
        const remainingImages =
          await tx.propertyImage.findMany({
            where: { propertyId: id },
            orderBy: [
              { position: "asc" },
              { id: "asc" },
            ],
          });

        const highestPosition =
          remainingImages.reduce(
            (max, image) =>
              Math.max(max, image.position),
            -1
          );

        const createdImages = [];

        for (const [index, image] of newImages.entries()) {
          const created = await tx.propertyImage.create({
            data: {
              propertyId: id,
              url: image.url,
              alt: body.title,
              position: highestPosition + index + 1,
              isPrimary: false,
            },
          });

          createdImages.push(created);
        }

        // 4. CHOISIR LA PHOTO PRINCIPALE
        const allImages = await tx.propertyImage.findMany({
          where: { propertyId: id },
          orderBy: [
            { position: "asc" },
            { id: "asc" },
          ],
        });

        if (allImages.length > 0) {
          let selectedId = primaryImageId;

          if (primaryNewImageIndex !== null) {
            selectedId =
              createdImages[primaryNewImageIndex].id;
          }

          // Conserver l'ancienne principale
          // si elle existe encore.
          if (!selectedId) {
            selectedId =
              allImages.find(
                (image) => image.isPrimary
              )?.id ?? allImages[0].id;
          }

          await tx.propertyImage.updateMany({
            where: { propertyId: id },
            data: { isPrimary: false },
          });

          await tx.propertyImage.update({
            where: { id: selectedId },
            data: { isPrimary: true },
          });
        }

        // 5. RENVOYER LE BIEN ACTUALISÉ
        return tx.property.findUnique({
          where: { id },
          include: {
            images: {
              orderBy: [
                { isPrimary: "desc" },
                { position: "asc" },
              ],
            },
          },
        });
      }
    );

    return NextResponse.json({
      message: "Bien et photos modifiés avec succès.",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("PUT /api/admin/biens/[id]", error);

    return NextResponse.json(
      {
        message:
          "Erreur lors de la modification du bien.",
      },
      { status: 500 }
    );
  }
}
