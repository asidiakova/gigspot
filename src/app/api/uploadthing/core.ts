import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

const f = createUploadthing({
  errorFormatter: (err) => {
    const message = err.message.toLowerCase();
    if (message.includes("filesizemismatch") || message.includes("too_large")) {
      return { message: "Image too large" };
    }
    if (message.includes("filetype") || message.includes("invalid file")) {
      return { message: "Invalid file type. Please upload an image" };
    }
    return { message: err.message };
  },
});

export const ourFileRouter = {
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),

  eventFlyer: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user || session.user.role !== "organizer")
        throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
