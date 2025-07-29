import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { imagekit } from "@/lib/imagekit";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const formUserId = formData.get("userId") as string;
    const parentId = (formData.get("parentId") as string) || null;

    // Validate user authorization
    if (formUserId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate file presence
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only images and PDF files are supported" },
        { status: 400 }
      );
    }

    // Validate parent folder if parentId is provided
    if (parentId) {
      const [parentFolder] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.userId, userId),
            eq(files.id, parentId),
            eq(files.isFolder, true)
          )
        );

      if (!parentFolder) {
        return NextResponse.json(
          { error: "Parent folder not found" },
          { status: 404 }
        );
      }
    }

    // Process file upload
    const buffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);
    const originalFileName = file.name;
    const fileExtension = originalFileName.split(".").pop() || "";

    // Create folder path
    const folderPath = parentId
      ? `/storex/${userId}/folder/${parentId}`
      : `/storex/${userId}`;

    const filename = `${uuidv4()}.${fileExtension}`;

    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: fileBuffer,
      fileName: filename,
      folder: folderPath,
      useUniqueFileName: false,
    });

    // Prepare file data for database
    const fileData = {
      name: originalFileName, // Keep original name for display
      path: uploadResponse.filePath,
      size: file.size,
      type: file.type,
      fileUrl: uploadResponse.url,
      thumbnailUrl: uploadResponse.thumbnailUrl || null,
      userId,
      parentId,
      isFolder: false,
      isStarred: false,
      isTrash: false,
    };

    // Save to database
    const [newFile] = await db.insert(files).values(fileData).returning();

    return NextResponse.json({
      success: true,
      file: newFile,
    });
  } catch (error) {
    console.error("File upload error:", error);

    // Handle specific ImageKit errors
    if (error instanceof Error && error.message.includes("ImageKit")) {
      return NextResponse.json(
        { error: "File upload service error" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
