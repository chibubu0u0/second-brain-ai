# Second Brain Clean V1

這是「以專案為核心」的 AI 第二大腦 Clean V1。

## 這一版做什麼？

- Project 為核心
- 每個 Project 有自己的 Chat
- 對話會存進 Supabase
- 右側有 Memory 面板：Decisions / Tasks / Assets metadata
- 先不做圖片生成
- 先不接 Google Cloud Storage
- 先不做 Auth / RLS
- 先把「專案執行紀錄」架構打穩

## Environment Variables

請在 Vercel 設定：

```env
OPENAI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Supabase SQL

到 Supabase → SQL Editor → New Query，貼上 `supabase/schema.sql` 並執行。

## 本機開發

```bash
npm install
npm run dev
```

## 部署

1. 上傳到 GitHub
2. Vercel import repo
3. 設定 Environment Variables
4. Deploy

## 資料結構

```txt
Project
  ├── Chats
  │     └── Messages
  ├── Decisions
  ├── Tasks
  └── Assets
```

下一階段再加入 Supabase Auth、Google Cloud Storage、Embedding / Semantic Search。
