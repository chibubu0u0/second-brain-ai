"use client";
import type { Chat, Project } from "@/lib/types";

type Props = { projects: Project[]; chats: Chat[]; selectedProjectId: string | null; selectedChatId: string | null; onSelectProject: (projectId: string) => void; onSelectChat: (chatId: string) => void; onNewProject: () => void; onNewChat: () => void; };

export function ProjectSidebar({ projects, chats, selectedProjectId, selectedChatId, onSelectProject, onSelectChat, onNewProject, onNewChat }: Props) {
  return <aside className="flex min-h-0 flex-col rounded-3xl border border-white/10 bg-neutral-900/70">
    <div className="border-b border-white/10 p-4">
      <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Projects</h2><button onClick={onNewProject} className="rounded-xl bg-white px-3 py-2 text-xs font-medium text-black">新增</button></div>
      <div className="space-y-2">{projects.map((project) => <button key={project.id} onClick={() => onSelectProject(project.id)} className={"w-full rounded-2xl px-3 py-3 text-left text-sm transition " + (selectedProjectId === project.id ? "bg-white text-black" : "bg-black/20 text-neutral-300 hover:bg-white/10")}><div className="font-medium">{project.name}</div><div className="mt-1 truncate text-xs opacity-70">{project.description || "尚無描述"}</div></button>)}</div>
    </div>
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">Chats</h2><button onClick={onNewChat} disabled={!selectedProjectId} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-white disabled:opacity-40">新對話</button></div>
      <div className="space-y-2">{chats.length === 0 ? <p className="rounded-2xl bg-black/20 p-3 text-sm text-neutral-500">這個專案還沒有聊天紀錄。</p> : chats.map((chat) => <button key={chat.id} onClick={() => onSelectChat(chat.id)} className={"w-full rounded-2xl px-3 py-3 text-left text-sm transition " + (selectedChatId === chat.id ? "border border-white/40 bg-white/10 text-white" : "bg-black/20 text-neutral-300 hover:bg-white/10")}><div className="truncate font-medium">{chat.title}</div><div className="mt-1 text-xs text-neutral-500">{chat.model}</div></button>)}</div>
    </div>
  </aside>;
}
