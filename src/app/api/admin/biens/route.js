
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { makeSlug } from "@/lib/slugify";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function fileToBase64(file, buffer) {
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

function optionalNumber(formData, field) {
  const value = String(formData.get(field) ?? "").trim();

  if (value === "") return null;

  const number = Number(value);

  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`Valeur invalide pour ${field}.`);
  }

  return number;
}

function optionalInteger(formData, field) {
  const value = optionalNumber(formData, field);

  if (value !== null && !Number.isInteger(value)) {
    throw new Error(`La valeur ${field} doit être entière.`);
  }

  return value;
}

function optionalText(formData, field) {
  return String(formData.get(field) ?? "").trim() || null;
}

export async function POST(request) {
  try {
    // Vérification de l'administrateur
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Non autorisé." },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const title = String(formData.get("title") ?? "").trim();
    const city = String(formData.get("city") ?? "").trim();
    const priceInput = String(formData.get("price") ?? "").trim();

    if (!title || !city || !priceInput) {
      return NextResponse.json(
        {
          message: "Titre, ville et prix sont obligatoires.",
        },
        { status: 400 }
      );
    }

    const price = Number(priceInput);

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        { message: "Le prix est invalide." },
        { status: 400 }
      );
    }

    // Type et transaction
    const propertyType = String(
      formData.get("type") || "MAISON"
    );

    const transaction = String(
      formData.get("transaction") || "VENTE"
    );

    const validTypes = [
      "MAISON",
      "APPARTEMENT",
      "IMMEUBLE",
      "TERRAIN",
      "LOCAL",
      "BUREAU",
      "AUTRE",
    ];

    if (
      !validTypes.includes(propertyType) ||
      !["VENTE", "LOCATION"].includes(transaction)
    ) {
      return NextResponse.json(
        { message: "Type de bien ou transaction invalide." },
        { status: 400 }
      );
    }

    // NOUVEAUX CHAMPS
    const surface = optionalNumber(formData, "surface");
    const landSurface = optionalNumber(formData, "landSurface");

    const orientationInput = optionalText(
      formData,
      "orientation"
    );

    const validOrientations = [
      "NORD",
      "SUD",
      "EST",
      "OUEST",
      "NORD_EST",
      "NORD_OUEST",
      "SUD_EST",
      "SUD_OUEST",
    ];

    // Accepte aussi les libellés "Sud-Ouest", etc.
    const orientationValue = orientationInput
      ? orientationInput
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toUpperCase()
          .replace(/[\s-]+/g, "_")
      : null;

    if (
      orientationValue &&
      !validOrientations.includes(orientationValue)
    ) {
      return NextResponse.json(
        { message: "Orientation invalide." },
        { status: 400 }
      );
    }

    // Vérification des autres nombres
    const rooms = optionalInteger(formData, "rooms");
    const bedrooms = optionalInteger(formData, "bedrooms");
    const bathrooms = optionalInteger(formData, "bathrooms");

    // Génération du slug
    const baseSlug = makeSlug(title);
    let finalSlug = baseSlug;
    let counter = 1;

    while (
      await prisma.property.findUnique({
        where: { slug: finalSlug },
      })
    ) {
      finalSlug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    // Récupération des photos
    const files = formData.getAll("images");

    const imagesToCreate = [];

    for (const file of files) {
      if (
        !file ||
        typeof file === "string" ||
        file.size === 0
      ) {
        continue;
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/avif",
      ];

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { message: "Format de photo non accepté." },
          { status: 400 }
        );
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          {
            message: "Chaque photo doit faire moins de 10 Mo.",
          },
          { status: 400 }
        );
      }
    }

    // Création du bien dans PostgreSQL
    const property = await prisma.property.create({
      data: {
        title,
        slug: finalSlug,
        type: propertyType,
        transaction,
        price,
        city,
        postalCode: optionalText(formData, "postalCode"),

        // Surfaces et orientation
        surface,
        landSurface,
        orientation: orientationValue,

        // Pièces
        rooms,
        bedrooms,
        bathrooms,

        // Descriptions
        shortDesc: optionalText(formData, "shortDesc"),
        description: optionalText(formData, "description"),

        // Diagnostics
        dpe: optionalText(formData, "dpe"),
        ges: optionalText(formData, "ges"),

        // Publication
        featured: formData.get("featured") === "true",
        published: formData.get("published") === "true",

        // Équipements
        hasGarden: formData.get("hasGarden") === "true",
        hasGarage: formData.get("hasGarage") === "true",
        hasTerrace: formData.get("hasTerrace") === "true",
        hasElevator: formData.get("hasElevator") === "true",
      },
    });

    // Enregistrement des photos Cloudinary
    for (const file of files) {
      if (
        !file ||
        typeof file === "string" ||
        file.size === 0
      ) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await cloudinary.uploader.upload(
        fileToBase64(file, buffer),
        {
          folder: "florian-immo/biens",
          resource_type: "image",
        }
      );

      imagesToCreate.push({
        propertyId: property.id,
        url: uploadResult.secure_url,
        alt: property.title,
        position: imagesToCreate.length,
        isPrimary: imagesToCreate.length === 0,
      });
    }

    if (imagesToCreate.length > 0) {
      await prisma.propertyImage.createMany({
        data: imagesToCreate,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: property,
        message: "Bien créé avec succès.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/biens error:", error);

    if (
      error.message?.startsWith("Valeur invalide") ||
      error.message?.includes("doit être entière")
    ) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message: "Erreur lors de la création du bien.",
      },
      { status: 500 }
    );
  }
}
