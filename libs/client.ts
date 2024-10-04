import { createClient } from 'microcms-js-sdk';

// APIキーとサービスドメインが環境変数に定義されているかチェック
if (!process.env.API_KEY || !process.env.SERVICE_DOMAIN) {
    throw new Error('API_KEY or SERVICE_DOMAIN is not defined in environment variables');
}

// clientオブジェクトの作成
export const client = createClient({
    serviceDomain: process.env.SERVICE_DOMAIN as string, // 自分のサービスドメインを設定
    apiKey: process.env.API_KEY as string,
});
