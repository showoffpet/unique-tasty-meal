import { Cloudinary } from "@cloudinary/url-gen";

/**
 * Cloudinary CDN client for image upload, transformation, and URL generation.
 * Uses NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME for the public cloud name.
 */
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

export const cldClient = new Cloudinary({
  cloud: {
    cloudName,
  },
  url: {
    secure: true,
  },
});

/**
 * Generate an optimized CDN URL for an image.
 */
export function getImageUrl(publicId: string): string {
  return cldClient.image(publicId).toURL();
}

/**
 * Server-side only: Cloudinary API credentials for upload/delete operations.
 * NEVER import these in client-side code.
 */
export const cloudinaryConfig = {
  cloudName,
  apiKey: process.env.CLOUDINARY_API_KEY || "",
  apiSecret: process.env.CLOUDINARY_API_SECRET || "",
};
