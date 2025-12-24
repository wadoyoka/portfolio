# Atsushi Portfolio

Enomoto Atsushi のポートフォリオサイトです。制作物やブログを掲載しています。

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS, Sass
- **UIコンポーネント**: shadcn/ui, Radix UI
- **CMS**: microCMS
- **認証**: NextAuth.js, Firebase
- **その他**:
  - Zod (バリデーション)
  - Nodemailer (メール送信)
  - next-sitemap (サイトマップ生成)
  - Upstash Redis (レート制限)

## 機能

- **Works**: 制作物の一覧・詳細表示
- **Blog**: ブログ記事の一覧・詳細表示
- **検索**: コンテンツ検索機能
- **タグ**: タグによるフィルタリング
- **お問い合わせ**: コンタクトフォーム
- **目次**: 記事の目次自動生成
- **OGP**: 動的OGP画像生成

## セットアップ

### 環境変数

`.env.template` をコピーして `.env.local` を作成し、各値を設定してください:

```bash
cp .env.template .env.local
```

### インストール

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアクセスできます。

### ビルド

```bash
npm run build
```

ビルド時にサイトマップも自動生成されます。

## ディレクトリ構成

```
├── app/                    # Next.js App Router
│   ├── about/             # Aboutページ
│   ├── api/               # APIルート
│   ├── blog/              # ブログページ
│   ├── contact/           # お問い合わせページ
│   ├── login/             # ログインページ
│   ├── search/            # 検索ページ
│   ├── tag/               # タグページ
│   └── work/              # 制作物詳細ページ
├── components/
│   ├── elements/          # 再利用可能なUI要素
│   ├── layouts/           # レイアウトコンポーネント
│   └── ui/                # shadcn/uiコンポーネント
├── hooks/                 # カスタムフック
├── lib/                   # ユーティリティ関数
├── libs/                  # 外部サービスクライアント
└── public/                # 静的ファイル
```

## ライセンス

MIT
