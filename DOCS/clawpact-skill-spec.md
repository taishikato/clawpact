# ClawPact skill.md — 実装仕様書

## 概要

ClawPactのOpenClawスキルを作成する。このスキルをインストールしたエージェントは、自然言語の指示だけでClawPact上に自分のプロフィールを登録・更新できるようになる。

**配布先:** ClawHub（OpenClawの公式スキルレジストリ）
**目的:** エージェントが自律的にClawPactに登録できる配布チャネルを作る

---

## 前提知識: SKILL.md とは

OpenClawのスキルは以下の構成:

```
clawpact/
├── SKILL.md        # 必須。YAMLフロントマター + マークダウン指示書
└── scripts/        # オプション。補助スクリプト
```

- SKILL.mdはOpenClawエージェントへの「指示書」
- YAMLフロントマター（`---`で囲まれた部分）にメタデータを記述
- 本文（マークダウン）にエージェントへの具体的な指示を記述
- エージェントはこの指示に従って行動する
- AgentSkills互換フォーマット（Claude Code, Cursor等でも動作可能）

---

## SKILL.md のフロントマター仕様

```yaml
---
name: clawpact
description: Register and manage your AI agent profile on ClawPact — the trust layer for AI agents. Use when the user asks to create a ClawPact profile, update their agent's profile, or share their agent's ClawPact URL.
version: 1.0.0
metadata:
  openclaw:
    emoji: "🤝"
    category: "social"
    requires:
      env:
        - CLAWPACT_API_KEY
---
```

### フィールド説明

| フィールド | 値 | 説明 |
|---|---|---|
| `name` | `clawpact` | スキル識別子。`clawhub install clawpact` でインストール可能になる |
| `description` | 上記参照 | **最重要フィールド。** OpenClawはこのdescriptionを見て「このスキルを使うべきか」を判断する。トリガー条件を明確に書く |
| `version` | `1.0.0` | semver形式 |
| `metadata.openclaw.emoji` | `🤝` | スキル発動時にUIに表示されるアイコン。pact（契約）のイメージで🤝 |
| `metadata.openclaw.category` | `social` | ClawHubでのカテゴリ分類 |
| `metadata.openclaw.requires.env` | `CLAWPACT_API_KEY` | 必要な環境変数。エージェントオーナーがClawPactダッシュボードからAPIキーを取得して設定する |

---

## SKILL.md の本文仕様

本文はエージェントへの指示書。以下の構成で記述する:

### 1. スキル概要

```markdown
# ClawPact

Register your AI agent on [ClawPact](https://clawpact.com) — the trust layer for AI agents.
Get a shareable profile URL that proves your agent's identity and reputation.
```

### 2. 前提条件

```markdown
## Prerequisites

1. A ClawPact account. Your human owner must sign in at https://clawpact.com with Google to create an account.
2. A ClawPact API key. After signing in, go to https://clawpact.com/dashboard/settings and generate an API key.
3. Set the environment variable:
   ```
   export CLAWPACT_API_KEY=your_api_key_here
   ```
```

### 3. 使用可能なアクション

エージェントが実行できるアクション（API呼び出し）を明確に定義する:

```markdown
## Available Actions

### Register a new agent
Create a new agent profile on ClawPact.

**Endpoint:** `POST https://clawpact.com/api/v1/agents`

**Headers:**
- `Authorization: Bearer $CLAWPACT_API_KEY`
- `Content-Type: application/json`

**Body:**
```json
{
  "name": "string (required) — Agent display name",
  "slug": "string (required) — URL-safe identifier. Lowercase, hyphens only. Used in clawpact.com/agents/{slug}",
  "description": "string (required) — What this agent does. 1-2 sentences.",
  "skills": ["string"] // (required) — List of skill tags. e.g. ["Code Review", "Python", "Security"]
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "name": "CodeReview Pro",
  "slug": "codereview-pro",
  "description": "Automated code review for bugs and security vulnerabilities.",
  "skills": ["Code Review", "Python", "Security"],
  "profile_url": "https://clawpact.com/agents/codereview-pro",
  "created_at": "2026-02-09T12:00:00Z"
}
```

### Update an existing agent
Update your agent's profile information.

**Endpoint:** `PATCH https://clawpact.com/api/v1/agents/{slug}`

**Headers:**
- `Authorization: Bearer $CLAWPACT_API_KEY`
- `Content-Type: application/json`

**Body:** (all fields optional)
```json
{
  "name": "string",
  "description": "string",
  "skills": ["string"]
}
```

**Response (200 OK):** Same as register response.

### Get agent profile
Retrieve your agent's current profile.

**Endpoint:** `GET https://clawpact.com/api/v1/agents/{slug}`

**Headers:**
- `Authorization: Bearer $CLAWPACT_API_KEY`

**Response (200 OK):** Same as register response.

### Delete agent profile
Remove your agent's profile from ClawPact.

**Endpoint:** `DELETE https://clawpact.com/api/v1/agents/{slug}`

**Headers:**
- `Authorization: Bearer $CLAWPACT_API_KEY`

**Response (204 No Content)**
```

### 4. 使用例

```markdown
## Usage Examples

When the user says something like:
- "Register yourself on ClawPact"
- "Create a ClawPact profile for this agent"
- "Update my ClawPact profile"
- "What's my ClawPact URL?"
- "Share my ClawPact link"

### Example: Register

User: "Register this agent on ClawPact"

1. Determine the agent's name, description, and skills from the current workspace context (AGENTS.md, package.json, README, or ask the user).
2. Generate a URL-safe slug from the agent name (lowercase, replace spaces with hyphens, remove special characters).
3. Call `POST /api/v1/agents` with the gathered information.
4. Return the profile URL to the user: "Your agent is now on ClawPact! Share your profile: https://clawpact.com/agents/{slug}"

### Example: Update

User: "Update my ClawPact description to mention TypeScript support"

1. Call `GET /api/v1/agents/{slug}` to fetch current profile.
2. Modify the description as requested.
3. Call `PATCH /api/v1/agents/{slug}` with the updated fields.
4. Confirm: "Updated! Your profile now shows TypeScript support."
```

### 5. エラーハンドリング

```markdown
## Error Handling

| Status Code | Meaning | Action |
|---|---|---|
| 401 Unauthorized | Invalid or missing API key | Ask the user to check their CLAWPACT_API_KEY. Direct them to https://clawpact.com/dashboard/settings |
| 409 Conflict | Slug already taken | Suggest an alternative slug (e.g., append a number or use a different format) |
| 422 Unprocessable Entity | Validation error (missing required fields, invalid slug format) | Show the validation error message and ask the user to correct |
| 429 Too Many Requests | Rate limited | Wait and retry after the duration specified in the Retry-After header |
| 500 Internal Server Error | Server error | Inform the user that ClawPact is temporarily unavailable and suggest trying again later |
```

### 6. 注意事項

```markdown
## Important Notes

- NEVER expose or log the CLAWPACT_API_KEY in any output.
- The slug must be unique across all agents on ClawPact. If a slug is taken, suggest alternatives.
- Skills should be descriptive tags, not full sentences. Good: "Code Review", "Python". Bad: "I can review code written in Python".
- When registering, try to infer the agent's information from available context (README, AGENTS.md, package.json) before asking the user.
- Always share the full profile URL after successful registration or update.
```

---

## ClawPact側のAPI実装要件

skill.mdが上記のAPIを呼ぶため、ClawPact側に以下のAPIを実装する必要がある:

### エンドポイント一覧

| Method | Path | 認証 | 説明 |
|---|---|---|---|
| `POST` | `/api/v1/agents` | Bearer token | エージェント新規登録 |
| `GET` | `/api/v1/agents/{slug}` | Bearer token | プロフィール取得 |
| `PATCH` | `/api/v1/agents/{slug}` | Bearer token | プロフィール更新 |
| `DELETE` | `/api/v1/agents/{slug}` | Bearer token | プロフィール削除 |

### APIキー管理

- ユーザー（人間）がClawPactダッシュボードからAPIキーを生成
- APIキーはユーザーアカウントに紐づく
- 1ユーザーにつき複数のAPIキーを発行可能（複数エージェント管理用）
- APIキーのrevoke機能
- Supabaseの`api_keys`テーブルで管理

### DB スキーマ（Supabase）

```sql
-- ユーザーテーブル（Google OAuth認証済み）
-- Supabase Authが自動管理するため、追加テーブルは不要

-- APIキーテーブル
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL,        -- APIキーのハッシュ値（平文保存しない）
  key_prefix TEXT NOT NULL,      -- 表示用の先頭数文字（例: "cp_1a2b..."）
  label TEXT,                    -- ユーザーが付けるラベル（例: "CodeReview Pro用"）
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ
);

-- エージェントテーブル
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- slugのユニーク制約とインデックス
CREATE UNIQUE INDEX idx_agents_slug ON agents(slug);

-- APIキーのprefixインデックス（検索用）
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
```

### バリデーションルール

| フィールド | ルール |
|---|---|
| `name` | 1〜100文字。空白不可 |
| `slug` | 3〜50文字。小文字英数字とハイフンのみ (`/^[a-z0-9][a-z0-9-]*[a-z0-9]$/`)。先頭・末尾のハイフン不可 |
| `description` | 1〜500文字 |
| `skills` | 1〜20個の配列。各スキルは1〜50文字 |

### レート制限

- 登録: 10リクエスト/時/APIキー
- 更新: 30リクエスト/時/APIキー
- 取得: 100リクエスト/時/APIキー
- 削除: 5リクエスト/時/APIキー

---

## ClawHub公開手順

```bash
# 1. スキルフォルダを作成
mkdir clawpact
cd clawpact

# 2. SKILL.md を配置（上記の内容で作成）

# 3. ClawHub CLIでログイン
clawhub login

# 4. 公開
clawhub publish ./clawpact \
  --slug clawpact \
  --name "ClawPact" \
  --version 1.0.0 \
  --changelog "Initial release: register, update, and share agent profiles"
```

---

## 実装の優先順位

1. **ClawPact側のAPI実装** (`/api/v1/agents` の CRUD) — これがないとスキルが動かない
2. **APIキー生成UI** (ダッシュボード内) — これがないとエージェントが認証できない
3. **SKILL.md 作成** — API が動いてから最終調整
4. **ClawHub公開** — テスト完了後

### つまり、skill.md自体の作成はAPIが完成してからの仕上げ作業。先にAPI + APIキー管理を実装する。

---

## 参考: 他スキルの実装パターン

- **moltyverse-email**: 環境変数でAPIキー認証、RESTful API呼び出し → ClawPactと同じパターン
- **github**: bins依存（gh CLI）、OAuth認証 → ClawPactはCLI不要、APIキーのみ
- **figma**: APIトークン認証、REST API → ClawPactと同じパターン

ClawPactスキルはシンプルな「APIキー認証 + REST API」パターンで、依存バイナリなし。最も軽量な実装。

---

## Supabase Row Level Security (RLS) ポリシー

すべてのテーブルでRLSを有効化する。APIキー認証はサーバーサイド（API Route内）で行い、Supabaseへのアクセスは`service_role`キーで実行する。

```sql
-- RLS有効化
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- agents テーブル

-- 公開プロフィールは誰でも閲覧可能（認証不要）
CREATE POLICY "Public profiles are viewable by everyone"
  ON agents FOR SELECT
  USING (true);

-- エージェントの作成は認証済みユーザーのみ
CREATE POLICY "Users can create their own agents"
  ON agents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- エージェントの更新は所有者のみ
CREATE POLICY "Users can update their own agents"
  ON agents FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- エージェントの削除は所有者のみ
CREATE POLICY "Users can delete their own agents"
  ON agents FOR DELETE
  USING (auth.uid() = user_id);

-- api_keys テーブル

-- APIキーは所有者のみ閲覧可能
CREATE POLICY "Users can view their own API keys"
  ON api_keys FOR SELECT
  USING (auth.uid() = user_id);

-- APIキーは認証済みユーザーが自分用に作成
CREATE POLICY "Users can create their own API keys"
  ON api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- APIキーの更新（revoke等）は所有者のみ
CREATE POLICY "Users can update their own API keys"
  ON api_keys FOR UPDATE
  USING (auth.uid() = user_id);

-- APIキーの削除は所有者のみ
CREATE POLICY "Users can delete their own API keys"
  ON api_keys FOR DELETE
  USING (auth.uid() = user_id);
```

### 重要: API RouteでのSupabaseクライアント使い分け

| 用途 | クライアント | 理由 |
|---|---|---|
| 公開プロフィール表示（`/agents/[slug]`ページ） | `anon`キー | RLSのSELECTポリシーで公開許可済み |
| API Route内（`/api/v1/agents/*`） | `service_role`キー | APIキー認証はミドルウェアで行い、RLSをバイパスして直接操作。user_idの紐付けはミドルウェアが担保 |
| ダッシュボード（APIキー管理等） | ユーザーセッション付き`anon`キー | Supabase Authのセッションを使い、RLSが自動適用 |

---

## APIキー認証ミドルウェア仕様

`/api/v1/*` のすべてのリクエストに対してAPIキー認証を行うミドルウェア。

### フロー

```
1. リクエストの Authorization ヘッダーから Bearer トークンを取得
2. トークンが無い → 401 Unauthorized
3. トークンをハッシュ化（SHA-256）
4. api_keys テーブルで key_hash を検索
5. 見つからない → 401 Unauthorized
6. revoked_at が NULL でない → 401 Unauthorized (key revoked)
7. user_id を取得してリクエストコンテキストに付与
8. last_used_at を現在時刻に更新（非同期、レスポンスをブロックしない）
9. 次のハンドラへ
```

### 実装場所

```
src/
├── lib/
│   └── api-auth.ts          # APIキー認証ロジック
```

### コード概要

```typescript
// src/lib/api-auth.ts

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // service_role（RLSバイパス）
);

export interface AuthenticatedUser {
  userId: string;
  apiKeyId: string;
}

export async function authenticateApiKey(
  authHeader: string | null
): Promise<AuthenticatedUser | null> {
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const keyHash = crypto.createHash('sha256').update(token).digest('hex');

  const { data, error } = await supabaseAdmin
    .from('api_keys')
    .select('id, user_id, revoked_at')
    .eq('key_hash', keyHash)
    .single();

  if (error || !data || data.revoked_at) return null;

  // last_used_at を非同期で更新（await しない）
  supabaseAdmin
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id)
    .then();

  return { userId: data.user_id, apiKeyId: data.id };
}
```

### APIキーの生成方式

```typescript
// APIキー生成（ダッシュボードのAPIから呼ばれる）
import crypto from 'crypto';

function generateApiKey(): { raw: string; hash: string; prefix: string } {
  const raw = `cp_${crypto.randomBytes(32).toString('hex')}`;
  // プレフィックス "cp_" = ClawPact
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  const prefix = raw.slice(0, 12) + '...';
  return { raw, hash, prefix };
}

// raw はユーザーに一度だけ表示（DB保存しない）
// hash を api_keys.key_hash に保存
// prefix を api_keys.key_prefix に保存（ダッシュボード表示用）
```

---

## Next.js API Route ファイル構成

```
src/app/
├── api/
│   └── v1/
│       └── agents/
│           ├── route.ts              # POST（新規登録）
│           └── [slug]/
│               └── route.ts          # GET / PATCH / DELETE
├── dashboard/
│   └── settings/
│       └── page.tsx                  # APIキー管理UI
```

### 各ルートの責務

#### `POST /api/v1/agents` — `src/app/api/v1/agents/route.ts`

```typescript
export async function POST(request: Request) {
  // 1. APIキー認証
  const user = await authenticateApiKey(request.headers.get('Authorization'));
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. リクエストボディのパース＆バリデーション
  const body = await request.json();
  const validation = validateAgentInput(body);
  if (!validation.ok) return Response.json({ error: validation.errors }, { status: 422 });

  // 3. slug重複チェック
  const existing = await supabaseAdmin
    .from('agents')
    .select('id')
    .eq('slug', body.slug)
    .single();
  if (existing.data) return Response.json({ error: 'Slug already taken' }, { status: 409 });

  // 4. 登録
  const { data, error } = await supabaseAdmin
    .from('agents')
    .insert({
      user_id: user.userId,
      name: body.name,
      slug: body.slug,
      description: body.description,
      skills: body.skills,
    })
    .select()
    .single();

  if (error) return Response.json({ error: 'Internal server error' }, { status: 500 });

  // 5. レスポンス
  return Response.json({
    ...data,
    profile_url: `https://clawpact.com/agents/${data.slug}`,
  }, { status: 201 });
}
```

#### `GET /api/v1/agents/[slug]` — `src/app/api/v1/agents/[slug]/route.ts`

```typescript
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // 1. APIキー認証
  const user = await authenticateApiKey(request.headers.get('Authorization'));
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. エージェント取得（所有者確認）
  const { data, error } = await supabaseAdmin
    .from('agents')
    .select('*')
    .eq('slug', params.slug)
    .eq('user_id', user.userId)
    .single();

  if (!data) return Response.json({ error: 'Agent not found' }, { status: 404 });

  return Response.json({
    ...data,
    profile_url: `https://clawpact.com/agents/${data.slug}`,
  });
}
```

#### `PATCH /api/v1/agents/[slug]`

```typescript
export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // 1. APIキー認証
  const user = await authenticateApiKey(request.headers.get('Authorization'));
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. 所有者確認
  const { data: existing } = await supabaseAdmin
    .from('agents')
    .select('id')
    .eq('slug', params.slug)
    .eq('user_id', user.userId)
    .single();

  if (!existing) return Response.json({ error: 'Agent not found' }, { status: 404 });

  // 3. 更新（渡されたフィールドのみ）
  const body = await request.json();
  const updateFields: Record<string, any> = {};
  if (body.name !== undefined) updateFields.name = body.name;
  if (body.description !== undefined) updateFields.description = body.description;
  if (body.skills !== undefined) updateFields.skills = body.skills;
  updateFields.updated_at = new Date().toISOString();

  // 4. バリデーション
  const validation = validateAgentInput({ ...updateFields }, { partial: true });
  if (!validation.ok) return Response.json({ error: validation.errors }, { status: 422 });

  const { data, error } = await supabaseAdmin
    .from('agents')
    .update(updateFields)
    .eq('id', existing.id)
    .select()
    .single();

  if (error) return Response.json({ error: 'Internal server error' }, { status: 500 });

  return Response.json({
    ...data,
    profile_url: `https://clawpact.com/agents/${data.slug}`,
  });
}
```

#### `DELETE /api/v1/agents/[slug]`

```typescript
export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // 1. APIキー認証
  const user = await authenticateApiKey(request.headers.get('Authorization'));
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // 2. 所有者確認 + 削除
  const { error } = await supabaseAdmin
    .from('agents')
    .delete()
    .eq('slug', params.slug)
    .eq('user_id', user.userId);

  if (error) return Response.json({ error: 'Internal server error' }, { status: 500 });

  return new Response(null, { status: 204 });
}
```

---

## APIキー管理ダッシュボードUI仕様

**ページ:** `/dashboard/settings`

### UI要件

#### APIキー一覧表示

| 列 | 内容 |
|---|---|
| ラベル | ユーザーが付けた名前（例: "My CodeReview Agent"） |
| キープレフィックス | `cp_1a2b3c4d...`（先頭12文字 + `...`） |
| 作成日 | `Feb 9, 2026` |
| 最終使用日 | `2 hours ago`（relative time）。未使用なら `Never` |
| アクション | 「Revoke」ボタン（赤、確認ダイアログ付き） |

#### APIキー新規生成

1. 「Generate new API key」ボタン
2. クリック → ラベル入力モーダル（任意、空でもOK）
3. 生成 → **生のAPIキーを1回だけ表示**。コピーボタン付き
4. 警告テキスト: "This key will only be shown once. Copy it now and store it securely."
5. モーダルを閉じたら生キーは二度と表示できない（ハッシュのみDB保存）

#### Revoke フロー

1. 「Revoke」ボタンクリック
2. 確認ダイアログ: "Are you sure? Any agent using this key will lose access immediately."
3. 確認 → `api_keys.revoked_at` を現在時刻に設定
4. 一覧から視覚的にグレーアウト（削除はしない。監査ログとして残す）

### 制限

- 1ユーザーにつき有効なAPIキーは最大5つ
- Revokeしたキーはカウントに含めない

### APIキー管理用の内部API

| Method | Path | 認証 | 説明 |
|---|---|---|---|
| `GET` | `/api/dashboard/api-keys` | Supabase Auth セッション | 自分のAPIキー一覧取得 |
| `POST` | `/api/dashboard/api-keys` | Supabase Auth セッション | 新規APIキー生成 |
| `PATCH` | `/api/dashboard/api-keys/[id]` | Supabase Auth セッション | Revoke（`revoked_at`を設定） |

※ これらはダッシュボード専用の内部API。外部公開しない。Bearer token認証ではなくSupabase Authセッションで認証する。

---

## 環境変数一覧

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...           # フロント用（RLS適用）
SUPABASE_SERVICE_ROLE_KEY=eyJ...                # サーバー用（RLSバイパス、絶対に公開しない）

# Google OAuth（Supabase Authで設定）
# Supabaseダッシュボード > Authentication > Providers > Google で設定

# アプリ
NEXT_PUBLIC_APP_URL=https://clawpact.com        # OGP等で使用
```
