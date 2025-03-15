# TODOリストアプリ データ設計

## Supabase テーブル設計

### users テーブル

sql
create table users (
id uuid references auth.users primary key,
email text unique not null,
name text,
created_at timestamp with time zone default timezone('utc'::text, now()) not null,
updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

### tasks テーブル

sql
create table tasks (
id uuid default uuid_generate_v4() primary key,
user_id uuid references users(id) not null,
title text not null,
description text,
due_date timestamp with time zone,
priority text check (priority in ('high', 'medium', 'low')) not null,
status text check (status in ('pending', 'completed')) default 'pending' not null,
created_at timestamp with time zone default timezone('utc'::text, now()) not null,
updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- インデックス
create index tasks_user_id_idx on tasks(user_id);
create index tasks_due_date_idx on tasks(due_date);
create index tasks_status_idx on tasks(status);

## RLS (Row Level Security) ポリシー

### users テーブル
```sql
-- 自分のレコードのみ参照・更新可能
create policy "Users can view own profile" 
  on users for select 
  using ( auth.uid() = id );

create policy "Users can update own profile" 
  on users for update 
  using ( auth.uid() = id );
```

### tasks テーブル
```sql
-- 自分のタスクのみ参照可能
create policy "Users can view own tasks" 
  on tasks for select 
  using ( auth.uid() = user_id );

-- 自分のタスクのみ作成可能
create policy "Users can create own tasks" 
  on tasks for insert 
  with check ( auth.uid() = user_id );

-- 自分のタスクのみ更新可能
create policy "Users can update own tasks" 
  on tasks for update 
  using ( auth.uid() = user_id );

-- 自分のタスクのみ削除可能
create policy "Users can delete own tasks" 
  on tasks for delete 
  using ( auth.uid() = user_id );
```

## TypeScript 型定義

```typescript
// ユーザー型
export type User = {
  id: string
  email: string
  name: string | null
  created_at: string
  updated_at: string
}

// タスク型
export type Task = {
  id: string
  user_id: string
  title: string
  description: string | null
  due_date: string | null
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'completed'
  created_at: string
  updated_at: string
}

// タスク作成時の型
export type CreateTaskInput = Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>

// タスク更新時の型
export type UpdateTaskInput = Partial<CreateTaskInput>
```

## データアクセスパターン

### 主要なクエリ
1. ユーザーのタスク一覧取得
```sql
select * from tasks 
where user_id = :current_user_id 
order by due_date asc, created_at desc;
```

2. ステータスでフィルター
```sql
select * from tasks 
where user_id = :current_user_id 
  and status = :status 
order by due_date asc, created_at desc;
```

3. 優先度でフィルター
```sql
select * from tasks 
where user_id = :current_user_id 
  and priority = :priority 
order by due_date asc, created_at desc;
```

### パフォーマンス考慮事項
1. インデックスの活用
   - user_id, due_date, statusにインデックスを作成し、検索を最適化
   
2. ページネーション実装
```sql
select * from tasks 
where user_id = :current_user_id 
order by due_date asc, created_at desc 
limit :limit offset :offset;
```

3. リアルタイム更新
   - Supabaseのリアルタイムサブスクリプション機能を活用
   - タスクの更新をリアルタイムに反映

## バリデーションルール

1. タスクタイトル
   - 必須
   - 1文字以上200文字以内

2. タスク説明
   - オプション
   - 1000文字以内

3. 期限日
   - オプション
   - 現在日時以降の日時のみ許可

4. 優先度
   - 必須
   - 'high', 'medium', 'low'のいずれか

5. ステータス
   - 必須
   - 'pending', 'completed'のいずれか
```

このデータ設計では以下の点に注意を払っています：

1. セキュリティ
   - RLSポリシーによる適切なアクセス制御
   - ユーザーごとのデータ分離

2. パフォーマンス
   - 適切なインデックス設計
   - ページネーション対応
   - リアルタイム更新の考慮

3. 型安全性
   - TypeScriptによる型定義
   - テーブル制約による整合性確保

4. 拡張性
   - タイムスタンプによる変更管理
   - ステータスや優先度の柔軟な拡張可能性

5. バリデーション
   - フロントエンド/バックエンドでの一貫したバリデーションルール
   - データの整合性確保