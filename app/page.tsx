"use client";
import { useEffect, useMemo, useState } from "react";
import { ChatPanel } from "@/components/ChatPanel";
import { MemoryPanel } from "@/components/MemoryPanel";
import { ProjectSidebar } from "@/components/ProjectSidebar";
import type { Asset, Chat, Decision, Message, Project, Task } from "@/lib/types";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [model, setModel] = useState("gpt-4o-mini");
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const selectedProject = useMemo(() => projects.find((p) => p.id === selectedProjectId) || null, [projects, selectedProjectId]);

  useEffect(() => { bootstrap(); }, []);
  useEffect(() => { if (selectedProjectId) loadProjectData(selectedProjectId); }, [selectedProjectId]);
  useEffect(() => { if (selectedChatId) loadMessages(selectedChatId); else setMessages([]); }, [selectedChatId]);

  async function bootstrap() {
    setBooting(true);
    try { const res = await fetch("/api/projects"); const data = await res.json(); if (!res.ok) throw new Error(data?.error || "Failed to load projects"); setProjects(data.projects || []); if (data.projects?.[0]?.id) setSelectedProjectId(data.projects[0].id); } catch (e) { console.error(e); } finally { setBooting(false); }
  }
  async function loadProjectData(projectId: string) {
    const [c, d, t, a] = await Promise.all([fetch(`/api/chats?projectId=${projectId}`), fetch(`/api/decisions?projectId=${projectId}`), fetch(`/api/tasks?projectId=${projectId}`), fetch(`/api/assets?projectId=${projectId}`)]);
    const cd = await c.json(); const dd = await d.json(); const td = await t.json(); const ad = await a.json();
    setChats(cd.chats || []); setDecisions(dd.decisions || []); setTasks(td.tasks || []); setAssets(ad.assets || []); setSelectedChatId(cd.chats?.[0]?.id || null);
  }
  async function loadMessages(chatId: string) { const res = await fetch(`/api/messages?chatId=${chatId}`); const data = await res.json(); setMessages(data.messages || []); }
  async function createProject() { const name = window.prompt("專案名稱，例如：Song Receipt Studio"); if (!name) return; const description = window.prompt("專案描述，可留空") || ""; const res = await fetch("/api/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description }) }); const data = await res.json(); if (!res.ok) { window.alert(data?.error || "建立專案失敗"); return; } setProjects((cur) => [data.project, ...cur]); setSelectedProjectId(data.project.id); }
  function createNewChat() { if (!selectedProjectId) return; setSelectedChatId(null); setMessages([]); }
  async function sendMessage(text: string, selectedModel: string) {
    if (!selectedProjectId) return;
    const userMessage: Message = { role: "user", content: text, model: selectedModel };
    const nextMessages = [...messages, userMessage]; setMessages(nextMessages); setLoading(true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId: selectedProjectId, chatId: selectedChatId, model: selectedModel, messages: nextMessages }) });
      const data = await res.json(); if (!res.ok) throw new Error(data?.error || "Chat API failed");
      if (data.chatId) setSelectedChatId(data.chatId);
      setMessages((cur) => [...cur, { role: "assistant", content: data.message, model: selectedModel }]);
      await loadProjectData(selectedProjectId); if (data.chatId) await loadMessages(data.chatId);
    } catch (e) { const msg = e instanceof Error ? e.message : "Unknown error"; setMessages((cur) => [...cur, { role: "assistant", content: "目前無法完成請求。請確認 Vercel Environment Variables 與 Supabase schema 都已設定。

錯誤訊息：" + msg }]); } finally { setLoading(false); }
  }
  async function addDecision() { if (!selectedProjectId) return; const title = window.prompt("這次決策是什麼？"); if (!title) return; const reason = window.prompt("為什麼這樣決定？可留空") || ""; const res = await fetch("/api/decisions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId: selectedProjectId, title, reason }) }); if (res.ok) await loadProjectData(selectedProjectId); }
  async function addTask() { if (!selectedProjectId) return; const title = window.prompt("新增待辦事項"); if (!title) return; const res = await fetch("/api/tasks", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ projectId: selectedProjectId, title }) }); if (res.ok) await loadProjectData(selectedProjectId); }

  if (booting) return <main className="flex min-h-screen items-center justify-center bg-neutral-950 text-white"><div className="rounded-3xl border border-white/10 bg-neutral-900 p-8">正在載入 Second Brain Clean V1...</div></main>;
  return <main className="h-screen overflow-hidden bg-neutral-950 p-4 text-white"><div className="mx-auto flex h-full max-w-[1600px] flex-col gap-4"><header className="flex items-center justify-between rounded-3xl border border-white/10 bg-neutral-900/70 px-5 py-4"><div><p className="text-xs text-neutral-500">Project Memory System</p><h1 className="text-2xl font-semibold md:text-3xl">Second Brain Clean V1</h1></div><div className="hidden rounded-2xl bg-black/20 px-4 py-3 text-sm text-neutral-400 md:block">先把專案、對話、決策與任務保存好，再進入 AI Memory。</div></header><div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[320px_1fr_340px]"><ProjectSidebar projects={projects} chats={chats} selectedProjectId={selectedProjectId} selectedChatId={selectedChatId} onSelectProject={setSelectedProjectId} onSelectChat={setSelectedChatId} onNewProject={createProject} onNewChat={createNewChat} /><ChatPanel project={selectedProject} chatId={selectedChatId} messages={messages} model={model} loading={loading} onSend={sendMessage} onModelChange={setModel} /><MemoryPanel decisions={decisions} tasks={tasks} assets={assets} onAddDecision={addDecision} onAddTask={addTask} /></div></div></main>;
}
