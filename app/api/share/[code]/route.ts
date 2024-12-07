import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isValidShareCode } from "@/lib/utils/code-generator";

export async function GET(
  req: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    if (!isValidShareCode(code)) {
      return NextResponse.json(
        { error: "Invalid share code" },
        { status: 400 }
      );
    }

    const share = await prisma.share.findUnique({
      where: { code },
    });

    if (!share) {
      return NextResponse.json({ error: "Share not found" }, { status: 404 });
    }

    if (new Date() > share.expiresAt) {
      return NextResponse.json({ error: "Share has expired" }, { status: 410 });
    }

    // Update access count
    await prisma.share.update({
      where: { code },
      data: {
        accessed: true,
        accessCount: { increment: 1 },
      },
    });

    return NextResponse.json({ share });
  } catch (error) {
    console.error("Share retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve share" },
      { status: 500 }
    );
  }
}
