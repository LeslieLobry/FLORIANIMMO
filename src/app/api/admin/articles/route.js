
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { makeSlug } from "@/lib/slugify";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const formData = await request.formData();

    const title = formData.get("title")?.toString().trim();
    const content = formData.get("content")?.toString().trim();

    if (!title || !content) {
      return NextResponse.json(
        { message: "Le titre et le contenu sont obligatoires." },
        { status: 400 }
      );
    }

    const baseSlug = makeSlug(title) || "article";
    let finalSlug = baseSlug;
    let counter = 1;

    while (
      await prisma.article.findUnique({
        where: { slug: finalSlug },
      })
    ) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    let coverImage = null;

    const image = formData.get("image");

    if (image && typeof image !== "string" && image.size > 0) {
      if (!image.type.startsWith("image/")) {
        return NextResponse.json(
          { message: "Le fichier doit être une image." },
          { status: 400 }
        );
      }

      if (image.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { message: "L'image ne doit pas dépasser 5 Mo." },
          { status: 400 }
        );
      }

      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const base64 = `data:${image.type};base64,${buffer.toString(
        "base64"
      )}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: "florian-immo/articles",
        resource_type: "image",
      });

      coverImage = result.secure_url;
    }

    const published = formData.get("published") === "true";

    const article = await prisma.article.create({
      data: {
        title,
        slug: finalSlug,
        excerpt: formData.get("excerpt")?.toString() || null,
        content,
        coverImage,
        author: formData.get("author")?.toString() || "Florian Immo",
        published,
        featured: formData.get("featured") === "true",
        publishedAt: published ? new Date() : null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: article,
        message: "Article enregistré avec succès.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/articles :", error);

    return NextResponse.json(
      { message: "Erreur lors de la création de l'article." },
      { status: 500 }
    );
  }
}
