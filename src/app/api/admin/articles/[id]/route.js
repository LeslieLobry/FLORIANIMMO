
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

// Vérification de l'administrateur
async function checkAdmin() {
  const session = await auth();

  return Boolean(
    session?.user && session.user.role === "ADMIN"
  );
}

// CONFIGURATION CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// MODIFIER UN ARTICLE
export async function PATCH(request, { params }) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article introuvable." },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const title = String(
      formData.get("title") ?? ""
    ).trim();

    const content = String(
      formData.get("content") ?? ""
    ).trim();

    const excerpt = String(
      formData.get("excerpt") ?? ""
    ).trim();

    const author = String(
      formData.get("author") ?? ""
    ).trim();

    if (!title || !content) {
      return NextResponse.json(
        {
          error: "Le titre et le contenu sont obligatoires.",
        },
        { status: 400 }
      );
    }

    const published =
      formData.get("published") === "true";

    const featured =
      formData.get("featured") === "true";

    // Conserver la photo existante
    let coverImage = article.coverImage;

    const image = formData.get("image");

    // Remplacer la photo uniquement si une nouvelle est fournie
    if (image instanceof File && image.size > 0) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/avif",
      ];

      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json(
          { error: "Format d'image non accepté." },
          { status: 400 }
        );
      }

      if (image.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "L'image ne doit pas dépasser 5 Mo." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(
        await image.arrayBuffer()
      );

      const uploadResult = await new Promise(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "florian-immo/articles",
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          stream.end(buffer);
        }
      );

      coverImage = uploadResult.secure_url;
    }

    // Enregistrement dans PostgreSQL
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        excerpt: excerpt || null,
        content,
        author: author || null,
        coverImage,
        published,
        featured,
        publishedAt: published
          ? article.publishedAt || new Date()
          : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Article modifié avec succès.",
      article: updatedArticle,
    });
  } catch (error) {
    console.error("Erreur modification article :", error);

    return NextResponse.json(
      { error: "Erreur lors de la modification." },
      { status: 500 }
    );
  }
}

// SUPPRIMER UN ARTICLE
export async function DELETE(request, { params }) {
  try {
    if (!(await checkAdmin())) {
      return NextResponse.json(
        { error: "Non autorisé." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Identifiant manquant." },
        { status: 400 }
      );
    }

    const article = await prisma.article.findUnique({
      where: { id },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article introuvable." },
        { status: 404 }
      );
    }

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Article supprimé avec succès.",
    });
  } catch (error) {
    console.error("Erreur suppression article :", error);

    return NextResponse.json(
      { error: "Erreur lors de la suppression." },
      { status: 500 }
    );
  }
}
