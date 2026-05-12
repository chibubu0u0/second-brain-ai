export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-2xl w-full p-10">
        <h1 className="text-5xl font-bold mb-4">
          Second Brain AI
        </h1>

        <p className="text-zinc-400 mb-8">
          Multi-model AI Workspace powered by OpenAI, Claude and Gemini.
        </p>

        <div className="border border-zinc-800 rounded-2xl p-6 bg-zinc-900">
          <p className="mb-3">🚀 Starter template ready.</p>
          <p className="text-zinc-400 text-sm">
            Connect Supabase and your AI providers to begin building your shared AI memory system.
          </p>
        </div>
      </div>
    </main>
  );
}
