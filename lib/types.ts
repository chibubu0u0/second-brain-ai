export type Project = { id: string; name: string; description: string | null; status: string; created_at: string; updated_at: string; };
export type Chat = { id: string; project_id: string; title: string; model: string; created_at: string; updated_at: string; };
export type Message = { id?: string; chat_id?: string; role: "user" | "assistant" | "system"; content: string; model?: string | null; created_at?: string; };
export type Decision = { id: string; project_id: string; title: string; content: string | null; reason: string | null; created_at: string; };
export type Task = { id: string; project_id: string; title: string; status: "todo" | "doing" | "done"; priority: "low" | "medium" | "high"; created_at: string; };
export type Asset = { id: string; project_id: string; file_name: string; file_type: string | null; storage_provider: string | null; storage_path: string | null; public_url: string | null; created_at: string; };
