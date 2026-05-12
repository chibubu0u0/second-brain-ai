create table workspaces (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_at timestamp default now()
);

create table chats (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id),
  title text,
  model text,
  created_at timestamp default now()
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  chat_id uuid references chats(id),
  role text,
  content text,
  created_at timestamp default now()
);
