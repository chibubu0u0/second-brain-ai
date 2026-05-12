import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
export const runtime = "nodejs";
export async function GET(request: Request) { try { const { searchParams } = new URL(request.url); const chatId = searchParams.get("chatId"); if (!chatId) return NextResponse.json({ messages: [] }); const supabase = createSupabaseAdminClient(); const { data, error } = await supabase.from("messages").select("*").eq("chat_id", chatId).order("created_at", { ascending: true }); if (error) throw new Error(error.message); return NextResponse.json({ messages: data || [] }); } catch (e) { const message = e instanceof Error ? e.message : "Unknown error"; return NextResponse.json({ error: message }, { status: 500 }); } }
