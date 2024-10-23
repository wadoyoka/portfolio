import DataFetcher from '@/lib/DateFether';
import { CryptoUtils } from '@/utils/crypto-utils';
import { checkRateLimitAction } from '@/utils/ratelimit';
import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            username: string;
        } & DefaultSession["user"]
    }

    interface User {
        id: string;
        username: string;
        name: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        username: string;
    }
}

// Firestoreから取得されるユーザーデータの型定義
interface FirestoreUser {
    id: string;
    UserName: string;  // Firestoreでのフィールド名に合わせて変更
    PassWord: string;  // Firestoreでのフィールド名に合わせて変更
    // 他の必要なフィールドがあれば追加
}

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }

                try {
                    const mockRequest = {
                        headers: headers(),
                        ip: (await headers()).get('x-forwarded-for') || 'unknown',
                    } as unknown as NextRequest
                    const rateLimitResult = await checkRateLimitAction(mockRequest, 'login');

                    if (!rateLimitResult.allowed) {
                        throw new Error(JSON.stringify({
                            type: 'rate_limit',
                            message: 'ログイン制限にかかりました、また1時間後にお試しください。',
                            remainingAttempts: rateLimitResult.remainingAttempts
                        }));
                    }

                    const hashedUserName = await CryptoUtils.base64Encode(credentials.username);

                    const users = await DataFetcher(hashedUserName) as FirestoreUser[];
                    const user = users[0]
                    if (!user) {
                        throw new Error(JSON.stringify({
                            type: 'auth_error',
                            message: 'ユーザー名または、パスワードが間違っています。',
                            remainingAttempts: rateLimitResult.remainingAttempts
                        }));
                    }

                    const base64EncodedInputPass = await CryptoUtils.base64Encode(credentials.password);
                    const secretUnion = base64EncodedInputPass + (process.env.SECRET_LOGIN_PASS_KEY as string);
                    const sha256HashedInputPass = await CryptoUtils.sha256Hash(secretUnion);
                    const ispass = await CryptoUtils.comparePassword(sha256HashedInputPass, user.PassWord);

                    if (!ispass) {
                        throw new Error(JSON.stringify({
                            type: 'auth_error',
                            message: 'ユーザー名または、パスワードが間違っています。',
                            remainingAttempts: rateLimitResult.remainingAttempts
                        }));
                    }

                    return {
                        id: user.id,
                        username: user.UserName,
                        name: user.UserName
                    };
                } catch (error) {
                    if (error instanceof Error) {
                        throw error; // This will be caught by NextAuth and returned to the client
                    }
                    console.error("Error during authentication:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 1* 60 * 60,
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

