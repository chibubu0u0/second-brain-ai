# Second Brain AI

一個可以部署到 GitHub + Vercel 的多人 AI 第二大腦 MVP starter。

## 功能

- Next.js App Router
- TailwindCSS
- Supabase schema
- OpenAI API route
- 基本聊天介面
- 可直接部署到 Vercel
- 後續可擴充 Claude / Gemini / Workspace / Auth / Memory

## 1. 安裝

```bash
npm install
npm run dev
```

本機開啟：

```txt
http://localhost:3000
```

## 2. 環境變數

複製 `.env.example` 成 `.env.local`

```bash
cp .env.example .env.local
```

填入：

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

> Claude / Gemini 可以之後再加。這一版先讓 Vercel 穩定部署成功。

## 3. Supabase

到 Supabase 的 SQL Editor，貼上：

```sql
-- supabase/schema.sql
```

或直接打開 `supabase/schema.sql` 複製內容執行。

## 4. Vercel 部署

1. 上傳到 GitHub
2. 到 Vercel import 這個 repo
3. 加入 Environment Variables
4. Deploy

## 5. 後續建議開發順序

1. Supabase Auth
2. Chat history 儲存
3. Workspace / Team
4. Claude / Gemini model router
5. Embedding / semantic search
