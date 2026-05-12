# Second Brain v1.1.0 — AI Memory Organizer

這是 v1.1.0：AI 自動整理專案記憶版本。

## 新增功能

- 保留 v1.0.0 的 Project / Chat / Message / Decision / Task / Asset 架構
- 新增 `memories` table
- 右側新增「整理本次對話」按鈕
- AI 會把目前 chat 整理成：Summary、Memories、Decisions、Tasks
- 整理結果會自動寫入 Supabase
- 右側會顯示 Memories / Decisions / Tasks / Assets

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

如果你已經有 v1.0.0 的資料表，這份 SQL 可以直接執行，會新增 `memories` table 與必要欄位/index。

## Deploy

1. 解壓縮 ZIP
2. 上傳到 GitHub repo 根目錄
3. Vercel 自動部署
4. 確認 Environment Variables
5. 執行 Supabase SQL
6. 測試「整理本次對話」

## Version

部署成功後建議建立 GitHub Release：

```txt
v1.1.0
AI Memory Organizer
```
