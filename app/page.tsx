"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function HomePage() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "你好，我是你的 Second Brain AI。這一版先確認 GitHub + Vercel + Supabase 架構可以正常跑起來。",
    },
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: nextMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "API request failed");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.message || "沒有取得回覆。",
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "發生未知錯誤";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "目前 API 尚未完成設定，或缺少 OPENAI_API_KEY。錯誤訊息：" + message,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-6">
        <header className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm text-neutral-400">Shared AI Memory Workspace</p>
            <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
              Second Brain AI
            </h1>
          </div>

          <select
            className="rounded-xl border border-white/10 bg-neutral-900 px-4 py-3 text-sm outline-none"
            value={model}
            onChange={(event) => setModel(event.target.value)}
          >
            <option value="gpt-4o-mini">GPT-4o mini</option>
            <option value="gpt-4o">GPT-4o</option>
          </select>
        </header>

        <section className="grid flex-1 gap-5 md:grid-cols-[280px_1fr]">
          <aside className="rounded-3xl border border-white/10 bg-neutral-900/60 p-5">
            <h2 className="mb-3 text-lg font-medium">Workspace</h2>
            <p className="text-sm leading-6 text-neutral-400">
              這裡之後可以放團隊空間、聊天紀錄、標籤、知識庫與 AI 記憶搜尋。
            </p>

            <div className="mt-6 rounded-2xl bg-black/30 p-4 text-sm text-neutral-300">
              <p className="font-medium text-white">目前版本</p>
              <p className="mt-2 text-neutral-400">MVP starter / Vercel deploy ready</p>
            </div>
          </aside>

          <section className="flex min-h-[620px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60">
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={
                    message.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl bg-white px-4 py-3 text-black"
                      : "mr-auto max-w-[85%] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white"
                  }
                >
                  <p className="whitespace-pre-wrap text-sm leading-6">
                    {message.content}
                  </p>
                </div>
              ))}

              {loading ? (
                <div className="mr-auto max-w-[85%] rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-neutral-400">
                  AI 正在思考中...
                </div>
              ) : null}
            </div>

            <div className="border-t border-white/10 p-4">
              <div className="flex gap-3">
                <input
                  className="flex-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-neutral-500"
                  placeholder="輸入訊息..."
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      sendMessage();
                    }
                  }}
                />
                <button
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-medium text-black disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={sendMessage}
                  disabled={loading}
                >
                  送出
                </button>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
