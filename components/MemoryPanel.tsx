"use client";
import type { Asset, Decision, Memory, Task } from "@/lib/types";

type Props = {
  memories: Memory[];
  decisions: Decision[];
  tasks: Task[];
  assets: Asset[];
  canOrganize: boolean;
  organizing: boolean;
  onOrganize: () => void;
  onAddDecision: () => void;
  onAddTask: () => void;
};

export function MemoryPanel({ memories, decisions, tasks, assets, canOrganize, organizing, onOrganize, onAddDecision, onAddTask }: Props) {
  return <aside className="flex min-h-0 flex-col gap-4 rounded-3xl border border-white/10 bg-neutral-900/70 p-4">
    <section className="rounded-3xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-neutral-500">AI Memory Organizer</p>
      <h2 className="mt-1 text-lg font-semibold">Project Memory</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-400">將目前對話自動整理成摘要、長期記憶、決策與任務。</p>
      <button onClick={onOrganize} disabled={!canOrganize || organizing} className="mt-4 w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-40">
        {organizing ? "整理中..." : "整理本次對話"}
      </button>
    </section>

    <section className="min-h-0"><h2 className="mb-3 font-semibold">Memories</h2><div className="max-h-48 space-y-2 overflow-y-auto">{memories.length === 0 ? <p className="rounded-2xl bg-black/20 p-3 text-sm text-neutral-500">尚無長期記憶。先完成一段聊天，再按「整理本次對話」。</p> : memories.slice(0, 8).map((m) => <div key={m.id} className="rounded-2xl bg-black/20 p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-medium">{m.title}</p><span className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-neutral-300">{m.memory_type}</span></div><p className="mt-1 line-clamp-3 text-xs leading-5 text-neutral-400">{m.content}</p></div>)}</div></section>

    <section><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Decisions</h2><button onClick={onAddDecision} className="rounded-xl border border-white/10 px-3 py-2 text-xs">新增</button></div><div className="max-h-40 space-y-2 overflow-y-auto">{decisions.length === 0 ? <p className="rounded-2xl bg-black/20 p-3 text-sm text-neutral-500">尚無決策紀錄。</p> : decisions.slice(0, 6).map((d) => <div key={d.id} className="rounded-2xl bg-black/20 p-3"><p className="text-sm font-medium">{d.title}</p>{d.reason ? <p className="mt-1 text-xs leading-5 text-neutral-400">{d.reason}</p> : null}</div>)}</div></section>

    <section><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Tasks</h2><button onClick={onAddTask} className="rounded-xl border border-white/10 px-3 py-2 text-xs">新增</button></div><div className="max-h-40 space-y-2 overflow-y-auto">{tasks.length === 0 ? <p className="rounded-2xl bg-black/20 p-3 text-sm text-neutral-500">尚無任務。</p> : tasks.slice(0, 6).map((t) => <div key={t.id} className="rounded-2xl bg-black/20 p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-medium">{t.title}</p><span className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-neutral-300">{t.status}</span></div><p className="mt-1 text-xs text-neutral-500">Priority：{t.priority}</p></div>)}</div></section>

    <section className="min-h-0"><h2 className="mb-3 font-semibold">Assets</h2><div className="space-y-2">{assets.length === 0 ? <p className="rounded-2xl bg-black/20 p-3 text-sm text-neutral-500">尚無檔案 metadata。下一階段可接 Google Cloud Storage。</p> : assets.slice(0, 4).map((a) => <div key={a.id} className="rounded-2xl bg-black/20 p-3"><p className="truncate text-sm font-medium">{a.file_name}</p><p className="mt-1 text-xs text-neutral-500">{a.storage_provider || "storage 未設定"}</p></div>)}</div></section>
  </aside>;
}
