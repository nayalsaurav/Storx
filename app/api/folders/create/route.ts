import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";

import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, userId: bodyUserId, parentId = null } = body;
    if (bodyUserId !== userId)
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "folder name is required" },
        { status: 400 }
      );
    }
    if (parentId) {
      const [parentData] = await db
        .select()
        .from(files)
        .where(
          and(
            eq(files.id, parentId),
            eq(files.id, userId),
            eq(files.isFolder, true)
          )
        );

      if (!parentData)
        return NextResponse.json(
          { error: "Parent folder not found" },
          { status: 404 }
        );
    }

    //create folder in db

    const folderData = {
      id: uuidv4(),
      name: name.trim(),
      path: `/folder/${userId}/${uuidv4()}`,
      size: 0,
      type: "folder",
      fileUrl: "",
      thumbnailUrl: null,
      imagekitFileId: null,
      userId,
      parentId,
      isFolder: true,
      isTrash: false,
      isStarred: false,
    };
    const [newFolder] = await db.insert(files).values(folderData).returning();
    return NextResponse.json(
      {
        success: true,
        message: "folder created successfully",
        folder: newFolder,
      },
      { status: 400 }
    );
  } catch (error) {}
}
