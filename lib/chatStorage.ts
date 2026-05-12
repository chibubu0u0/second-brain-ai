import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export async function getOrCreateWorkspace() {
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

export async function getOrCreateChat({
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

export async function saveMessage({
  chatId,
  role,
  content,
  messageType = "text",
  imageData = null,
  imageMime = null,
}: {
  chatId: string;
  role: "user" | "assistant";
  content: string;
  messageType?: "text" | "image" | "image_prompt";
  imageData?: string | null;
  imageMime?: string | null;
}) {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.from("messages").insert({
    chat_id: chatId,
    role,
    content,
    message_type: messageType,
    image_data: imageData,
    image_mime: imageMime,
  });

  if (error) {
    throw new Error(error.message);
  }

  await supabase
    .from("chats")
    .update({
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId);
}
