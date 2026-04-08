import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 },
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "You summarize articles concisely. Return only the summary text, no extra formatting.",
        },
        {
          role: "user",
          content: `Summarize the following article in 2-4 sentences:\n\n${content}`,
        },
      ],
    });

    const summary = response.choices[0]?.message?.content ?? "";

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error("POST /api/summary error:", error);
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 },
    );
  }
}
