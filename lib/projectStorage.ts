import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export async function getOrCreateDefaultWorkspace() {
  const supabase = createSupabaseAdminClient();
  const { data: existing, error: selectError } = await supabase.from("workspaces").select("id").eq("name", "Default Workspace").maybeSingle();
  if (selectError) throw new Error(selectError.message);
  if (existing?.id) return existing.id as string;
  const { data, error } = await supabase.from("workspaces").insert({ name: "Default Workspace" }).select("id").single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function ensureDefaultProject() {
  const supabase = createSupabaseAdminClient();
  const workspaceId = await getOrCreateDefaultWorkspace();
  const { data: existing, error: selectError } = await supabase.from("projects").select("id").eq("name", "AI 第二大腦").maybeSingle();
  if (selectError) throw new Error(selectError.message);
  if (existing?.id) return existing.id as string;
  const { data, error } = await supabase.from("projects").insert({ workspace_id: workspaceId, name: "AI 第二大腦", description: "保存專案執行紀錄、對話、決策與未來 AI 記憶的核心專案。", status: "active" }).select("id").single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function getOrCreateChat({ projectId, chatId, model, firstUserMessage }: { projectId: string; chatId?: string | null; model: string; firstUserMessage: string; }) {
  const supabase = createSupabaseAdminClient();
  if (chatId) {
    const { data: existing, error } = await supabase.from("chats").select("id").eq("id", chatId).eq("project_id", projectId).maybeSingle();
    if (error) throw new Error(error.message);
    if (existing?.id) return existing.id as string;
  }
  const title = firstUserMessage.length > 36 ? firstUserMessage.slice(0, 36) + "..." : firstUserMessage || "New Chat";
  const { data, error } = await supabase.from("chats").insert({ project_id: projectId, title, model }).select("id").single();
  if (error) throw new Error(error.message);
  return data.id as string;
}

export async function saveMessage({ chatId, role, content, model }: { chatId: string; role: "user" | "assistant" | "system"; content: string; model?: string | null; }) {
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("messages").insert({ chat_id: chatId, role, content, model: model || null });
  if (error) throw new Error(error.message);
  await supabase.from("chats").update({ updated_at: new Date().toISOString() }).eq("id", chatId);
}
