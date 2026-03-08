import sharp from "sharp";

export interface ProcessedImage {
  buffer: Buffer;
  mimeType: string;
  size: number;
}

export const processMealImage = async (
  file: Buffer,
  originalFilename: string,
  originalSize: number,
): Promise<ProcessedImage> => {
  // Validate size (under 5MB)
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  if (originalSize > MAX_SIZE) {
    throw new Error("Image size exceeds 5MB limit");
  }

  // Validate file type
  const extension = originalFilename.split(".").pop()?.toLowerCase();
  if (!["jpg", "jpeg", "png"].includes(extension || "")) {
    throw new Error("Invalid file type. Only JPEG and PNG are allowed.");
  }

  // Process image
  const buffer = await sharp(file)
    .resize(600, 400, {
      fit: "cover",
      position: "center",
    })
    .toFormat("jpeg", { quality: 85 })
    .toBuffer();

  return {
    buffer,
    mimeType: "image/jpeg",
    size: buffer.length,
  };
};
