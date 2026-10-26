import "server-only";

import type { UploadApiResponse } from "cloudinary";
import cloudinary from "@/lib/cloudinary/config";

const profileFolder = "portfolio/profile";
const profilePublicId = "profile-image";

export async function uploadProfileImage(file: File): Promise<{
  url: string;
  publicId: string;
}> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: profileFolder,
        public_id: profilePublicId,
        overwrite: true,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else if (!result) reject(new Error("Cloudinary returned no upload result."));
        else resolve(result);
      },
    );
    stream.end(buffer);
  });

  return { url: uploaded.secure_url, publicId: uploaded.public_id };
}
