import { imagekit } from "@/lib/imagekit";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    const authParams = imagekit.getAuthenticationParameters();

    return Response.json({
      authParams,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "failed to generate auth parameters for imagekit" },
      { status: 500 },
    );
  }
}
