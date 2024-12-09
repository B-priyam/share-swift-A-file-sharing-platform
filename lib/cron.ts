import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { deleteFromCloudinary } from "./cloudinary";

const prisma = new PrismaClient();

async function deleteExpiredFiles() {
  try {
    // Get all files older than 24 hours
    const expiredShares = await prisma.share.findMany({
      where: {
        createdAt: {
          lte: new Date(Date.now() - 90 * 1000),
        },
      },
    });

    for (const share of expiredShares) {
      let type = share.mimeType?.split("/")[0];
      if (share.publicId) {
        await deleteFromCloudinary(
          share.publicId,
          type === "image"
            ? "image"
            : type === "audio"
            ? "audio"
            : type === "video"
            ? "video"
            : "raw"
        );
      }

      await prisma.share.delete({
        where: { id: share.id },
      });

      console.log(`Deleted file and record: ${share.id}`);
    }
  } catch (error) {
    console.error("Error deleting expired files:", error);
  }
}

cron.schedule("*/10 * * * * *", deleteExpiredFiles);
