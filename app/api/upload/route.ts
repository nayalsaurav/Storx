import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    //parse request body
    const body = await request.json();

    const { imagekit, userId: bodyUserId } = body;

    if (bodyUserId !== userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    if (!imagekit || !imagekit.url) {
      return NextResponse.json(
        { error: "invalid file upload data" },
        { status: 403 }
      );
    }

    const fileData = {
      name: imagekit.name || "untitled",
      path: imagekit.filePath || `/storex/${userId}/${imagekit.name}`,
      size: imagekit.size || 0,
      type: imagekit.type || "image",
      fileUrl: imagekit.url,
      imagekitFileId: imagekit.fileId,
      thumbnailUrl: imagekit.thumbnailUrl || null,
      userId: userId,
      parentId: null,
      isFolder: false,
      isStarred: false,
      isTrash: false,
    };

    const [newFile] = await db.insert(files).values(fileData).returning();
    return NextResponse.json({
      newFile,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "failed to save info data to database" },
      { status: 403 }
    );
  }
}
