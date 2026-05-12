import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

type OrganizedMemory = { title?: string; content?: string; memory_type?: string; importance?: string; };
type OrganizedDecision = { title?: string; content?: string; reason?: string; };
type OrganizedTask = { title?: string; description?: string; priority?: string; };
type OrganizedResult = { summary?: string; memories?: OrganizedMemory[]; decisions?: OrganizedDecision[]; tasks?: OrganizedTask[]; };

export const runtime = "nodejs";
export const maxDuration = 60;

function normalizeMemoryType(value: unknown) {
  const allowed = ["summary", "insight", "technical_note", "design_note", "business_note", "next_step", "decision"];
  return typeof value === "string" && allowed.includes(value) ? value : "insight";
}
function normalizeImportance(value: unknown) {
  const allowed = ["low", "medium", "high"];
  return typeof value === "string" && allowed.includes(value) ? value : "medium";
}
function normalizePriority(value: unknown) {
  const allowed = ["low", "medium", "high"];
  return typeof value === "string" && allowed.includes(value) ? value : "medium";
}

export async function POST(request: Request) {
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) return NextResponse.json({ error: "Missing OPENAI_API_KEY." }, { status: 500 });

    const body = await request.json();
    const projectId = typeof body.projectId === "string" ? body.projectId : "";
    const chatId = typeof body.chatId === "string" ? body.chatId : "";
    const model = typeof body.model === "string" ? body.model : "gpt-4o-mini";
    if (!projectId || !chatId) return NextResponse.json({ error: "projectId and chatId are required." }, { status: 400 });

    const supabase = createSupabaseAdminClient();
    const { data: messages, error: messagesError } = await supabase
      .from("messages")
      .select("role, content, created_at")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (messagesError) throw new Error(messagesError.message);
    if (!messages || messages.length === 0) return NextResponse.json({ error: "No messages found for this chat." }, { status: 400 });

    const transcript = messages.map((m) => `${m.role}: ${m.content}`).join("\n\n");
    const openai = new OpenAI({ apiKey: openaiApiKey });

    const completion = await openai.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "你是專案第二大腦的整理器。請把對話整理成可長期保存的專案記憶。只輸出 JSON，不要輸出 Markdown。JSON 必須包含 summary, memories, decisions, tasks。memories 最多 5 筆，decisions 最多 5 筆，tasks 最多 5 筆。memory_type 只能是 summary, insight, technical_note, design_note, business_note, next_step, decision。importance 和 priority 只能是 low, medium, high。" },
        { role: "user", content: `請整理以下專案對話。請用繁體中文輸出 JSON。\n\n${transcript}` },
      ],
      temperature: 0.2,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    let parsed: OrganizedResult;
    try { parsed = JSON.parse(raw) as OrganizedResult; } catch { parsed = { summary: raw, memories: [], decisions: [], tasks: [] }; }

    const summary = typeof parsed.summary === "string" ? parsed.summary.trim() : "";
    const memoryRows = [];
    if (summary) memoryRows.push({ project_id: projectId, source_chat_id: chatId, title: "本次對話摘要", content: summary, memory_type: "summary", importance: "high" });

    for (const memory of parsed.memories || []) {
      const title = typeof memory.title === "string" ? memory.title.trim() : "";
      const content = typeof memory.content === "string" ? memory.content.trim() : "";
      if (!title || !content) continue;
      memoryRows.push({ project_id: projectId, source_chat_id: chatId, title, content, memory_type: normalizeMemoryType(memory.memory_type), importance: normalizeImportance(memory.importance) });
    }

    const decisionRows = (parsed.decisions || []).map((d) => ({ project_id: projectId, related_chat_id: chatId, title: typeof d.title === "string" ? d.title.trim() : "", content: typeof d.content === "string" ? d.content.trim() : "", reason: typeof d.reason === "string" ? d.reason.trim() : "" })).filter((d) => d.title);
    const taskRows = (parsed.tasks || []).map((t) => ({ project_id: projectId, title: typeof t.title === "string" ? t.title.trim() : "", description: typeof t.description === "string" ? t.description.trim() : "", priority: normalizePriority(t.priority), status: "todo" })).filter((t) => t.title);

    if (memoryRows.length > 0) { const { error } = await supabase.from("memories").insert(memoryRows); if (error) throw new Error(error.message); }
    if (decisionRows.length > 0) { const { error } = await supabase.from("decisions").insert(decisionRows); if (error) throw new Error(error.message); }
    if (taskRows.length > 0) { const { error } = await supabase.from("tasks").insert(taskRows); if (error) throw new Error(error.message); }

    return NextResponse.json({ ok: true, counts: { memories: memoryRows.length, decisions: decisionRows.length, tasks: taskRows.length } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
