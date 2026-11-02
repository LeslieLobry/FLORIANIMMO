
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request) {
  try {
    // 1. Vérifier que l'utilisateur est administrateur
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Non autorisé." },
        { status: 401 }
      );
    }

    // 2. Vérifier la configuration Cloudinary
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { message: "Configuration Cloudinary manquante." },
        { status: 500 }
      );
    }

    // 3. Récupérer la photo
    const formData = await request.formData();
    const file = formData.get("file");

    if (
      !file ||
      typeof file === "string" ||
      typeof file.arrayBuffer !== "function" ||
      file.size === 0
    ) {
      return NextResponse.json(
        { message: "Aucune photo valide reçue." },
        { status: 400 }
      );
    }

    // 4. Vérifier le format
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          message:
            "Format non accepté. Utilisez JPG, PNG, WebP, GIF ou AVIF.",
        },
        { status: 400 }
      );
    }

    // 5. Vérifier la taille
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "La photo ne doit pas dépasser 10 Mo." },
        { status: 400 }
      );
    }

    // 6. Convertir la photo en Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64Image =
      `data:${file.type};base64,${buffer.toString("base64")}`;

    // 7. Envoyer sur Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      base64Image,
      {
        folder: "florian-immo/biens",
        resource_type: "image",
      }
    );

    // 8. Retourner l'URL au formulaire
    return NextResponse.json({
      success: true,
      message: "Photo envoyée avec succès.",
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    console.error(
      "POST /api/admin/biens/upload-photo error:",
      error
    );

    return NextResponse.json(
      { message: "Erreur lors de l'envoi de la photo." },
      { status: 500 }
    );
  }
}
