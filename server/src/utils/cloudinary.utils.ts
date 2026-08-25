import cloudinary from "../config/cloudinary.config";

/**
 * Uploads a Multer in-memory/disk file buffer to Cloudinary under the
 * given folder, returning the public URL + public_id needed to later
 * delete the asset.
 */
export const uploadToCloudinary = async (
  filePath: string,
  folder: string,
): Promise<{ url: string; public_id: string }> => {
  const result = await cloudinary.uploader.upload(filePath, { folder });
  return { url: result.secure_url, public_id: result.public_id };
};

/** Removes a previously uploaded Cloudinary asset (e.g. when replacing an image). */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
};
