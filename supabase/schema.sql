-- Second Brain AI MVP Schema
-- Run this in Supabase SQL Editor.

create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamp with time zone default now()
);

create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  title text not null default 'New Chat',
  model text not null default 'gpt-4o-mini',
  created_at timestamp with time zone default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default now()
);

-- Optional later:
-- create extension if not exists vector;
-- alter table messages add column if not exists embedding vector(1536);
