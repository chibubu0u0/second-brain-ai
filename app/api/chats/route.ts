import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
export const runtime = "nodejs";
export async function GET(request: Request) { try { const { searchParams } = new URL(request.url); const projectId = searchParams.get("projectId"); if (!projectId) return NextResponse.json({ chats: [] }); const supabase = createSupabaseAdminClient(); const { data, error } = await supabase.from("chats").select("*").eq("project_id", projectId).order("updated_at", { ascending: false }); if (error) throw new Error(error.message); return NextResponse.json({ chats: data || [] }); } catch (e) { const message = e instanceof Error ? e.message : "Unknown error"; return NextResponse.json({ error: message }, { status: 500 }); } }
