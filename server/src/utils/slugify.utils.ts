import slugify from "slugify";
import mongoose from "mongoose";

/**
 * Builds a unique, URL-safe slug for a document by appending a short
 * random suffix if the base slug is already taken.
 */
export const generateUniqueSlug = async (
  model: mongoose.Model<any>,
  name: string,
): Promise<string> => {
  const base = slugify(name, { lower: true, strict: true });
  let candidate = base;
  let suffix = 0;

  while (await model.exists({ slug: candidate })) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }

  return candidate;
};
