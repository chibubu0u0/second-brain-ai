-- Second Brain Clean V1 Schema
-- Run this in Supabase SQL Editor.

create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  name text not null,
  description text,
  status text not null default 'active',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists chats (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
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
  model text,
  created_at timestamp with time zone default now()
);

create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  content text,
  reason text,
  related_chat_id uuid references chats(id) on delete set null,
  created_at timestamp with time zone default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'doing', 'done')),
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  due_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  message_id uuid references messages(id) on delete set null,
  file_name text not null,
  file_type text,
  storage_provider text,
  storage_path text,
  public_url text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

create index if not exists projects_workspace_id_idx on projects(workspace_id);
create index if not exists chats_project_id_idx on chats(project_id);
create index if not exists messages_chat_id_idx on messages(chat_id);
create index if not exists messages_created_at_idx on messages(created_at);
create index if not exists decisions_project_id_idx on decisions(project_id);
create index if not exists tasks_project_id_idx on tasks(project_id);
create index if not exists assets_project_id_idx on assets(project_id);

-- Clean V1 暫時不開 RLS，讓 Vercel server route 可以快速寫入。
-- 正式多人產品上線前，下一步應該加入：
-- 1. Supabase Auth
-- 2. workspace_members
-- 3. Row Level Security policies

-- Future AI Memory:
-- create extension if not exists vector;
-- alter table messages add column if not exists embedding vector(1536);
-- create table memories (...);
