import { client } from "@/libs/client";
import { Metadata } from 'next'; // 必要なメタデータを取得する場合

// メタデータを生成（任意）
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Portfolio',
  };
}

// ビルド時にデータを取得してページを静的に生成
export default async function HomePage() {
  // SSGのため、ビルド時にデータを取得
  const data = await getData();

  return (
    <div>
      <h1>Portfolio</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

// ビルド時にデータを取得するための関数
async function getData() {
  const data = await client.get({
    endpoint: process.env.SERVICE_DOMAIN as string,
  });
  return data;
}
