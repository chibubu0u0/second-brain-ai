"use client";
import type { Asset, Decision, Task } from "@/lib/types";

type Props = { decisions: Decision[]; tasks: Task[]; assets: Asset[]; onAddDecision: () => void; onAddTask: () => void; };

export function MemoryPanel({ decisions, tasks, assets, onAddDecision, onAddTask }: Props) {
  return <aside className="flex min-h-0 flex-col gap-4 rounded-3xl border border-white/10 bg-neutral-900/70 p-4">
    <section><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Decisions</h2><button onClick={onAddDecision} className="rounded-xl border border-white/10 px-3 py-2 text-xs">新增</button></div><div className="space-y-2">{decisions.length === 0 ? <p className="rounded-2xl bg-black/20 p-3 text-sm text-neutral-500">尚無決策紀錄。</p> : decisions.slice(0, 5).map((d) => <div key={d.id} className="rounded-2xl bg-black/20 p-3"><p className="text-sm font-medium">{d.title}</p>{d.reason ? <p className="mt-1 text-xs leading-5 text-neutral-400">{d.reason}</p> : null}</div>)}</div></section>
    <section><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">Tasks</h2><button onClick={onAddTask} className="rounded-xl border border-white/10 px-3 py-2 text-xs">新增</button></div><div className="space-y-2">{tasks.length === 0 ? <p className="rounded-2xl bg-black/20 p-3 text-sm text-neutral-500">尚無任務。</p> : tasks.slice(0, 6).map((t) => <div key={t.id} className="rounded-2xl bg-black/20 p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-medium">{t.title}</p><span className="rounded-full bg-white/10 px-2 py-1 text-[10px] text-neutral-300">{t.status}</span></div><p className="mt-1 text-xs text-neutral-500">Priority：{t.priority}</p></div>)}</div></section>
    <section className="min-h-0 flex-1"><h2 className="mb-3 font-semibold">Assets</h2><div className="space-y-2">{assets.length === 0 ? <p className="rounded-2xl bg-black/20 p-3 text-sm text-neutral-500">尚無檔案 metadata。下一階段會接 Google Cloud Storage。</p> : assets.slice(0, 6).map((a) => <div key={a.id} className="rounded-2xl bg-black/20 p-3"><p className="truncate text-sm font-medium">{a.file_name}</p><p className="mt-1 text-xs text-neutral-500">{a.storage_provider || "storage 未設定"}</p></div>)}</div></section>
  </aside>;
}
