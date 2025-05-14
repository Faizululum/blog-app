import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const token = (await cookies()).get("token")?.value;
      if (!token) throw new UploadThingError("Unauthorized");

      const user = await verifyAuth(token);
      if (!user) throw new UploadThingError("Unauthorized");

      return { userId: user.userId as string };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      // Ensure returning JSON-safe data
      return { uploadedBy: String(metadata.userId) };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;