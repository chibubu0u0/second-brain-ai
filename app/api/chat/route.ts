import { NextResponse } from "next/server";
import OpenAI from "openai";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing OPENAI_API_KEY. Please add it in Vercel Environment Variables.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const model = typeof body.model === "string" ? body.model : "gpt-4o-mini";
    const messages = Array.isArray(body.messages) ? body.messages : [];

    const safeMessages = messages
      .filter(
        (message: ChatMessage) =>
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string"
      )
      .map((message: ChatMessage) => ({
        role: message.role,
        content: message.content,
      }));

    const openai = new OpenAI({
      apiKey,
    });

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are the AI assistant inside a shared second brain workspace. Answer clearly and help organize knowledge.",
        },
        ...safeMessages,
      ],
      temperature: 0.7,
    });

    const message =
      completion.choices[0]?.message?.content ||
      "I could not generate a response.";

    return NextResponse.json({ message });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
