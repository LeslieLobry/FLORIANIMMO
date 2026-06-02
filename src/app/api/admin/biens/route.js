import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { makeSlug } from "../../../../../lib/slugify";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const title = formData.get("title");
    const city = formData.get("city");
    const price = formData.get("price");

    if (!title || !city || !price) {
      return NextResponse.json(
        { message: "Titre, ville et prix sont obligatoires." },
        { status: 400 }
      );
    }

    const baseSlug = makeSlug(title.toString());
    let finalSlug = baseSlug;
    let counter = 1;

    while (await prisma.property.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    const files = formData.getAll("images");

    const property = await prisma.property.create({
      data: {
        title: title.toString(),
        slug: finalSlug,
        type: (formData.get("type") || "MAISON").toString(),
        transaction: (formData.get("transaction") || "VENTE").toString(),
        price: Number(price),
        city: city.toString(),
        postalCode: formData.get("postalCode")?.toString() || null,
        surface: formData.get("surface") ? Number(formData.get("surface")) : null,
        rooms: formData.get("rooms") ? Number(formData.get("rooms")) : null,
        bedrooms: formData.get("bedrooms") ? Number(formData.get("bedrooms")) : null,
        bathrooms: formData.get("bathrooms") ? Number(formData.get("bathrooms")) : null,
        shortDesc: formData.get("shortDesc")?.toString() || null,
        description: formData.get("description")?.toString() || null,
        dpe: formData.get("dpe")?.toString() || null,
        ges: formData.get("ges")?.toString() || null,
        featured: formData.get("featured") === "true",
        published: formData.get("published") === "true",
        hasGarden: formData.get("hasGarden") === "true",
        hasGarage: formData.get("hasGarage") === "true",
        hasTerrace: formData.get("hasTerrace") === "true",
        hasElevator: formData.get("hasElevator") === "true",
      },
    });

    if (files.length > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });

      const imagesToCreate = [];

      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];

        if (!file || typeof file === "string" || file.size === 0) continue;
        if (!file.type?.startsWith("image/")) continue;

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const extension = file.name.split(".").pop() || "jpg";
        const fileName = `${uuidv4()}.${extension}`;
        const filePath = path.join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        imagesToCreate.push({
          propertyId: property.id,
          url: `/uploads/${fileName}`,
          alt: property.title,
          position: i,
          isPrimary: i === 0,
        });
      }

      if (imagesToCreate.length > 0) {
        await prisma.propertyImage.createMany({
          data: imagesToCreate,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: property,
      message: "Bien créé avec succès.",
    });
  } catch (error) {
    console.error("POST /api/admin/biens error:", error);

    return NextResponse.json(
      { message: "Erreur lors de la création du bien." },
      { status: 500 }
    );
  }
}