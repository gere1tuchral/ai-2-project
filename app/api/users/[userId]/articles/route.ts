import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

type Context = {
  params: Promise<{ userId: string }>;
};

export async function GET(_req: NextRequest, { params }: Context) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId } = await params;

    const articles = await prisma.article.findMany({
      where: { clerkId: userId },
      include: { quizzes: true },
      orderBy: { createdAt: "desc" },
    });

    const quizHistory = await prisma.score.findMany({
      where: { clerkId: userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ articles, quizHistory }, { status: 200 });
  } catch (error) {
    console.error("GET /api/users/[userId]/articles error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 },
    );
  }
}
