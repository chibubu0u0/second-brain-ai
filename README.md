# Second Brain AI — Supabase Saved Chat Version

這一版已經升級成：

- 可以呼叫 OpenAI
- 可以把對話存進 Supabase
- 可以自動建立 workspace / chat
- 可以把 user 與 assistant 訊息寫入 messages
- AI 回覆會用 Markdown 正確渲染，不會再直接顯示 `###`、`**` 這類原始格式

## Quick Start

```bash
npm install
npm run dev
```

## Environment Variables

請在 Vercel 裡設定：

```env
OPENAI_API_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

> `NEXT_PUBLIC_SUPABASE_ANON_KEY` 用 publish / anon key。  
> `SUPABASE_SERVICE_ROLE_KEY` 用 secret / service_role key，只能放在 Vercel 後端環境變數，不可以放到前端公開。

## Supabase SQL

到 Supabase：

SQL Editor → New Query

貼上 `supabase/schema.sql` 的內容並執行。

## GitHub / Vercel

1. 解壓縮 ZIP
2. 把資料夾內所有檔案上傳到 GitHub
3. Vercel 會自動重新部署
4. 到 Vercel Environment Variables 補上上面的 key
5. Redeploy

## Database Tables

- workspaces
- chats
- messages

## Next Step

下一版可以做：

- 左側聊天歷史紀錄
- Supabase Auth 登入
- Team workspace
- Claude / Gemini 模型切換
- Embedding / AI Memory
