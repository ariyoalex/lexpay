import config from "../config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

export async function uploadPhoto(
  buffer: Buffer,
  folder: string,
  publicId?: string,
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `lexpay/${folder}`,
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
        transformation: [{ width: 400, height: 400, crop: "fill", quality: "auto" }],
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Upload failed"));
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    uploadStream.end(buffer);
  });
}

export async function deletePhoto(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
