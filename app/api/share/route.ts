import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateShareCode } from "@/lib/utils/code-generator";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { ShareType } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function getCloudinaryPublicId(url: string) {
  const path = new URL(url).pathname; // /raw/upload/v1751218708/swiftshare/docs/18-6.pdf
  const parts = path.split("/");
  const versionIndex = parts.findIndex((p) => /^v\d+$/.test(p)); // Find 'v1751218708'
  const publicIdParts = parts.slice(versionIndex + 1); // ['swiftshare', 'docs', '18-6.pdf']

  const filename = publicIdParts.pop(); // '18-6.pdf'
  const nameWithoutExt = filename?.replace(/\.[^/.]+$/, ""); // remove .pdf

  publicIdParts.push(nameWithoutExt!); // ['swiftshare', 'docs', '18-6']
  return publicIdParts.join("/"); // 'swiftshare/docs/18-6'
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { type, content, mimeType, name } = data;

    if (!type || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const code = generateShareCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    let finalContent = "";
    let publicId = "";

    if (type === ShareType.TEXT) {
      finalContent = content;
    } else {
      // type === ShareType.FILE ?

      const cloudinaryUrl: any =
        type === ShareType.FILE
          ? await uploadToCloudinary(name, content, "swiftshare/docs", "raw")
          : type === ShareType.VIDEO
          ? await uploadToCloudinary(
              name,
              content,
              "swiftshare/videos",
              "video"
            )
          : type === ShareType.IMAGE
          ? await uploadToCloudinary(
              name,
              content,
              "swiftshare/images",
              "image"
            )
          : type === ShareType.AUDIO
          ? await uploadToCloudinary(
              name,
              content,
              "swiftshare/videos",
              "video"
            )
          : "";

      finalContent = cloudinaryUrl;
      publicId = getCloudinaryPublicId(cloudinaryUrl);
    }

    const share = await prisma.share.create({
      data: {
        code,
        type,
        content: finalContent,
        mimeType,
        expiresAt,
        publicId,
      },
    });

    return NextResponse.json({ code: share.code });
  } catch (error) {
    console.error("Share creation error:", error);
    return NextResponse.json(
      { error: "Failed to process share request" },
      { status: 500 }
    );
  }
}
