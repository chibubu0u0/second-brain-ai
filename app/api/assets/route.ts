import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
export const runtime = "nodejs";
export async function GET(request: Request) { try { const projectId = new URL(request.url).searchParams.get("projectId"); if (!projectId) return NextResponse.json({ assets: [] }); const supabase = createSupabaseAdminClient(); const { data, error } = await supabase.from("assets").select("*").eq("project_id", projectId).order("created_at", { ascending: false }); if (error) throw new Error(error.message); return NextResponse.json({ assets: data || [] }); } catch (e) { const message = e instanceof Error ? e.message : "Unknown error"; return NextResponse.json({ error: message }, { status: 500 }); } }
