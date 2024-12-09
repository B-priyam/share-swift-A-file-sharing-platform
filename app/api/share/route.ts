import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateShareCode } from "@/lib/utils/code-generator";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { ShareType } from "@prisma/client";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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

    if (type === ShareType.TEXT) {
      finalContent = content;
    } else {
      // type === ShareType.FILE ?

      const cloudinaryUrl =
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
    }

    const share = await prisma.share.create({
      data: {
        code,
        type,
        content: finalContent,
        mimeType,
        expiresAt,
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
