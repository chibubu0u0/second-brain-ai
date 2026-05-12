import { NextResponse } from "next/server";
import {
  getOrCreateChat,
  saveMessage,
} from "@/lib/chatStorage";

export const runtime = "nodejs";
export const maxDuration = 60;

type OpenAIImageResponse = {
  data?: Array<{
    b64_json?: string;
    url?: string;
    revised_prompt?: string;
  }>;
  error?: {
    message?: string;
  };
};

export async function POST(request: Request) {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return NextResponse.json(
        {
          error:
            "Missing OPENAI_API_KEY. Please add it in Vercel Environment Variables.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const requestedChatId =
      typeof body.chatId === "string" ? body.chatId : null;
    const size =
      typeof body.size === "string" ? body.size : "1024x1024";

    if (!prompt) {
      return NextResponse.json(
        { error: "Image prompt is required." },
        { status: 400 }
      );
    }

    const chatId = await getOrCreateChat({
      chatId: requestedChatId,
      model: "gpt-image-1",
      firstUserMessage: prompt,
    });

    await saveMessage({
      chatId,
      role: "user",
      content: prompt,
      messageType: "image_prompt",
    });

    const imageResponse = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size,
        quality: "medium",
        output_format: "png",
        n: 1,
      }),
    });

    const data = (await imageResponse.json()) as OpenAIImageResponse;

    if (!imageResponse.ok) {
      throw new Error(data.error?.message || "OpenAI image generation failed.");
    }

    const b64 = data.data?.[0]?.b64_json;
    const imageUrl = data.data?.[0]?.url;

    const imageData = b64
      ? `data:image/png;base64,${b64}`
      : imageUrl || "";

    if (!imageData) {
      throw new Error("No image data returned from OpenAI.");
    }

    const message =
      "圖片已生成。你可以直接下載，或把這個結果保存在第二大腦紀錄裡。";

    await saveMessage({
      chatId,
      role: "assistant",
      content: message,
      messageType: "image",
      imageData,
      imageMime: b64 ? "image/png" : "image/url",
    });

    return NextResponse.json({
      chatId,
      message,
      imageData,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
