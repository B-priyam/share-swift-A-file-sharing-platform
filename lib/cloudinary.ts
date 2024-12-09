import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
};

export async function uploadToCloudinary(
  name: string,
  base64Data: string,
  folder: string,
  resourceType: "image" | "raw" | "video" | "audio" = "raw"
): Promise<string> {
  const timestamp = Math.round(new Date().getTime() / 1000);

  // Generate signature
  const publicId = `${folder}/${name}`;
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      folder,
      public_id: publicId,
    },
    cloudinaryConfig.api_secret
  );

  console.log("Generated Signature:", signature);

  // Prepare form data
  const formData = new FormData();
  formData.append("file", base64Data);
  formData.append("api_key", cloudinaryConfig.api_key);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder); // Ensure it's included once
  formData.append("public_id", publicId); // Custom file name
  formData.append("resource_type", resourceType);

  // Use the appropriate resource type in the endpoint
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorDetails = await response.json();
    console.error("Cloudinary Error:", errorDetails);
    throw new Error(
      `Failed to upload to Cloudinary: ${
        errorDetails.error?.message || "Unknown error"
      }`
    );
  }

  const result = await response.json();
  return result.secure_url;
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "raw" | "video" | "audio" = "raw"
): Promise<void> {
  const timestamp = Math.round(new Date().getTime() / 1000);

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
    console.error("Cloudinary Error:", errorDetails);
    throw new Error(
      `Failed to delete from Cloudinary: ${
        errorDetails.error?.message || "Unknown error"
      }`
    );
  }
}
