import sharp from "sharp";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ProcessImageOptions {
  width?: number;
  height?: number;
  quality?: number;
}

/**
 * Validates and processes an uploaded image file.
 * - Validates file type (JPEG, PNG, WebP)
 * - Checks file size (max 5MB)
 * - Resizes to specified dimensions
 * - Returns processed buffer
 */
export async function processImage(
  file: Buffer | ArrayBuffer,
  mimeType: string,
  options: ProcessImageOptions = {},
): Promise<Buffer> {
  const { width = 600, height = 400, quality = 80 } = options;

  // Validate file type
  if (!ALLOWED_TYPES.includes(mimeType)) {
    throw new Error(
      `Invalid file type: ${mimeType}. Allowed types: ${ALLOWED_TYPES.join(", ")}`,
    );
  }

  const buffer = Buffer.isBuffer(file) ? file : Buffer.from(file);

  // Validate file size
  if (buffer.length > MAX_FILE_SIZE) {
    throw new Error(
      `File size ${(buffer.length / 1024 / 1024).toFixed(1)}MB exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    );
  }

  // Process image
  const processed = await sharp(buffer)
    .resize(width, height, {
      fit: "cover",
      position: "center",
    })
    .jpeg({ quality })
    .toBuffer();

  return processed;
}

/**
 * Processes an avatar image (square, 400x400px).
 */
export async function processAvatar(
  file: Buffer | ArrayBuffer,
  mimeType: string,
): Promise<Buffer> {
  return processImage(file, mimeType, {
    width: 400,
    height: 400,
    quality: 85,
  });
}

/**
 * Processes a review photo (800x600px).
 */
export async function processReviewPhoto(
  file: Buffer | ArrayBuffer,
  mimeType: string,
): Promise<Buffer> {
  return processImage(file, mimeType, {
    width: 800,
    height: 600,
    quality: 80,
  });
}
