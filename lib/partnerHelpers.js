
import { v2 as cloudinary } from "cloudinary";

export function parsePartnerForm(formData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(
    formData.get("description") ?? ""
  ).trim();
  const websiteInput = String(
    formData.get("website") ?? ""
  ).trim();

  const positionInput = String(
    formData.get("position") ?? "0"
  );

  const position = Number(positionInput);

  if (!name) {
    throw new Error("Le nom du partenaire est obligatoire.");
  }

  if (name.length > 200) {
    throw new Error("Le nom est trop long.");
  }

  if (!Number.isSafeInteger(position) || position < 0) {
    throw new Error("L'ordre d'affichage est invalide.");
  }

  let website = null;

  if (websiteInput) {
    try {
      const normalized = /^https?:\/\//i.test(websiteInput)
        ? websiteInput
        : `https://${websiteInput}`;

      const url = new URL(normalized);

      if (
        !["http:", "https:"].includes(url.protocol) ||
        !url.hostname.includes(".")
      ) {
        throw new Error("Adresse invalide.");
      }

      website = url.href;
    } catch {
      throw new Error("L'adresse du site internet est invalide.");
    }
  }

  return {
    name,
    description: description || null,
    website,
    position,
    published: formData.get("published") === "true",
  };
}

export async function uploadPartnerLogo(file) {
  if (!file || typeof file === "string" || file.size === 0) {
    return null;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error("Format du logo non accepté.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Le logo ne doit pas dépasser 5 Mo.");
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "florian-immo/partenaires",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(buffer);
  });

  return result.secure_url;
}
