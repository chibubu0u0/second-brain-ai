import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const runtime = "nodejs";

async function getOrCreateWorkspace() {
  const supabase = createSupabaseAdminClient();

  const { data: existingWorkspace, error: selectError } = await supabase
    .from("workspaces")
    .select("id")
    .eq("name", "Default Workspace")
    .maybeSingle();

  if (selectError) {
    throw new Error(selectError.message);
  }

  if (existingWorkspace?.id) {
    return existingWorkspace.id;
  }

  const { data: workspace, error: insertError } = await supabase
    .from("workspaces")
    .insert({
      name: "Default Workspace",
    })
    .select("id")
    .single();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return workspace.id;
}

async function getOrCreateChat({
  chatId,
  model,
  firstUserMessage,
}: {
  chatId?: string | null;
  model: string;
  firstUserMessage: string;
}) {
  const supabase = createSupabaseAdminClient();

  if (chatId) {
    const { data: existingChat, error } = await supabase
      .from("chats")
      .select("id")
      .eq("id", chatId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (existingChat?.id) {
      return existingChat.id;
    }
  }

  const workspaceId = await getOrCreateWorkspace();
  const title =
    firstUserMessage.length > 30
      ? firstUserMessage.slice(0, 30) + "..."
      : firstUserMessage || "New Chat";

  const { data: chat, error } = await supabase
    .from("chats")
    .insert({
      workspace_id: workspaceId,
      title,
      model,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return chat.id;
}

async function saveMessage({
  chatId,
  role,
  content,
}: {
  chatId: string;
  role: "user" | "assistant";
  content: string;
}) {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("messages").insert({
    chat_id: chatId,
    role,
    content,
  });

  if (error) {
    throw new Error(error.message);
  }
}

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
    const model = typeof body.model === "string" ? body.model : "gpt-4o-mini";
    const requestedChatId =
      typeof body.chatId === "string" ? body.chatId : null;
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

    const latestUserMessage = [...safeMessages]
      .reverse()
      .find((message) => message.role === "user");

    if (!latestUserMessage) {
      return NextResponse.json(
        { error: "No user message found." },
        { status: 400 }
      );
    }

    const chatId = await getOrCreateChat({
      chatId: requestedChatId,
      model,
      firstUserMessage: latestUserMessage.content,
    });

    await saveMessage({
      chatId,
      role: "user",
      content: latestUserMessage.content,
    });

    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "你是 Second Brain AI 裡的團隊知識助理。請用繁體中文回答。回答要乾淨、易讀、有結構。除非使用者明確要求程式碼，否則不要輸出程式碼區塊。可以使用標題與條列，但避免過度使用 Markdown 原始符號。",
        },
        ...safeMessages,
      ],
      temperature: 0.7,
    });

    const assistantMessage =
      completion.choices[0]?.message?.content ||
      "我目前無法產生回覆。";

    await saveMessage({
      chatId,
      role: "assistant",
      content: assistantMessage,
    });

    return NextResponse.json({
      chatId,
      message: assistantMessage,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
