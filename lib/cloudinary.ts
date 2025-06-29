import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
};

// Sanitize the file name to remove problematic characters
function sanitizeFileName(fileName: string): string {
  const noSlashes = fileName.replace(/[\\/]/g, "_"); // remove slashes
  const asciiOnly = noSlashes.replace(/[^\x20-\x7E]/g, ""); // remove hidden unicode
  const safe = asciiOnly.replace(/[^\w.\-]/g, "_"); // final clean
  return safe;
}

// Upload function
export async function uploadToCloudinary(
  name: string,
  base64Data: string,
  folder: string,
  resourceType: "image" | "raw" | "video" | "audio" = "raw"
): Promise<string> {
  const timestamp = Math.round(Date.now() / 1000);

  // Sanitize the file name
  const cleanName = sanitizeFileName(name);

  // Use only the clean file name as public_id (folder is passed separately)
  const publicId = cleanName;

  const formData = new FormData();
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
      public_id: publicId,
    },
    cloudinaryConfig.api_secret
  );

  formData.append("signature", signature);
  formData.append("file", base64Data);
  formData.append("api_key", cloudinaryConfig.api_key);
  formData.append("timestamp", timestamp.toString());
  formData.append("folder", folder); // Use folder parameter separately
  formData.append("public_id", publicId); // Safe file name only
  formData.append("resource_type", resourceType);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorDetails = await response.json();
    console.error("Cloudinary Upload Error:", errorDetails);
    throw new Error(
      `Failed to upload to Cloudinary: ${
        errorDetails.error?.message || "Unknown error"
      }`
    );
  }

  const result = await response.json();
  return result.secure_url; // Or return full result if needed
}

// Delete function
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "raw" | "video" | "audio" = "raw"
): Promise<void> {
  const timestamp = Math.round(Date.now() / 1000);

  // Generate signature
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      public_id: publicId,
    },
    cloudinaryConfig.api_secret
  );

  const formData = new FormData();
  formData.append("public_id", publicId);
  formData.append("api_key", cloudinaryConfig.api_key);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/${resourceType}/destroy`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorDetails = await response.json();
    console.error("Cloudinary Delete Error:", errorDetails);
    throw new Error(
      `Failed to delete from Cloudinary: ${
        errorDetails.error?.message || "Unknown error"
      }`
    );
  }
}
