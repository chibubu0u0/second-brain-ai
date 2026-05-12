"use client";
import { useState } from "react";
import type { Message, Project } from "@/lib/types";
import { MarkdownMessage } from "@/components/MarkdownMessage";

type Props = { project: Project | null; chatId: string | null; messages: Message[]; model: string; loading: boolean; onSend: (text: string, model: string) => Promise<void>; onModelChange: (model: string) => void; };

export function ChatPanel({ project, chatId, messages, model, loading, onSend, onModelChange }: Props) {
  const [input, setInput] = useState("");
  async function submit() { const text = input.trim(); if (!text || loading || !project) return; setInput(""); await onSend(text, model); }
  return <section className="flex min-h-0 flex-col rounded-3xl border border-white/10 bg-neutral-900/70">
    <div className="flex flex-col gap-3 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
      <div><p className="text-xs text-neutral-500">Current Project</p><h2 className="text-xl font-semibold">{project ? project.name : "尚未選擇專案"}</h2><p className="mt-1 text-xs text-neutral-500">Chat ID：{chatId || "送出第一則訊息後建立"}</p></div>
      <select value={model} onChange={(e) => onModelChange(e.target.value)} className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"><option value="gpt-4o-mini">GPT-4o mini</option><option value="gpt-4o">GPT-4o</option></select>
    </div>
    <div className="flex-1 space-y-4 overflow-y-auto p-5">
      {messages.length === 0 ? <div className="rounded-3xl border border-dashed border-white/10 bg-black/20 p-6 text-sm leading-7 text-neutral-400"><p className="mb-2 text-white">這裡會保存專案的對話紀錄。</p><p>你可以把每一次產品決策、開發想法、資料庫設計、錯誤排查都放在對應專案裡。</p></div> : messages.map((message, index) => <div key={`${message.role}-${message.id || index}`} className={message.role === "user" ? "ml-auto max-w-[85%] rounded-2xl bg-white px-4 py-3 text-black" : "mr-auto max-w-[85%] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white"}>{message.role === "assistant" ? <MarkdownMessage content={message.content} /> : <p className="whitespace-pre-wrap text-sm leading-7">{message.content}</p>}</div>)}
      {loading ? <div className="mr-auto max-w-[85%] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-neutral-400">AI 正在整理這個專案的回覆...</div> : null}
    </div>
    <div className="border-t border-white/10 p-4"><div className="flex gap-3"><textarea className="min-h-[52px] flex-1 resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm leading-6 outline-none placeholder:text-neutral-500" placeholder={project ? "輸入這個專案的想法、問題、決策或下一步..." : "請先建立或選擇一個專案"} value={input} disabled={!project || loading} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }} /><button className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-50" onClick={submit} disabled={!project || loading}>送出</button></div></div>
  </section>;
}
