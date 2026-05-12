-- Second Brain AI Supabase Schema
-- Run this in Supabase SQL Editor.

create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamp with time zone default now()
);

create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  title text not null default 'New Chat',
  model text not null default 'gpt-4o-mini',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default now()
);

create index if not exists chats_workspace_id_idx on chats(workspace_id);
create index if not exists messages_chat_id_idx on messages(chat_id);
create index if not exists messages_created_at_idx on messages(created_at);

-- MVP 階段先不開 RLS，讓 server route 可以快速寫入。
-- 正式多人產品上線前，建議加入 Supabase Auth + RLS policies。

-- Optional later:
-- create extension if not exists vector;
-- alter table messages add column if not exists embedding vector(1536);
