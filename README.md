# Second Brain AI — Text + Image + Supabase Version

這一版已經升級成：

- 文字聊天
- 圖片生成
- 文字訊息存進 Supabase
- 圖片 prompt 與圖片結果存進 Supabase
- AI 回覆用 Markdown 正確渲染
- 可部署到 GitHub + Vercel

## Quick Start

```bash
npm install
npm run dev
```

## Vercel Environment Variables

請在 Vercel 裡設定：

```env
OPENAI_API_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Supabase SQL

到 Supabase：

SQL Editor → New Query

貼上 `supabase/schema.sql` 的內容並執行。

如果你之前已經建立過 `workspaces`、`chats`、`messages`，這份 SQL 也可以直接執行，會自動補上圖片需要的欄位。

## 使用方式

頁面右上方可以切換：

- 文字聊天
- 生成圖片

圖片生成會使用 OpenAI Images API，並將圖片以 base64 data URL 顯示在畫面上。

## 注意

圖片 base64 會存進 Supabase 的 `messages.image_data` 欄位。MVP 階段這樣最快；正式產品建議改成：

- Supabase Storage 存圖片檔
- Database 只存 image_url
