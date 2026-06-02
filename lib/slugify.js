import slugify from "slugify";

export function makeSlug(value) {
  return slugify(value || "", {
    lower: true,
    strict: true,
    locale: "fr",
    trim: true,
  });
}