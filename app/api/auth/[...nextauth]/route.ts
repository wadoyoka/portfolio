import DataFetcher from '@/lib/DateFether';
import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
                    const users = await DataFetcher(credentials.username) as FirestoreUser[];
                    console.log(users);
                    const user = users[0]

                    if (!user) {
                        console.log("User not found");
                        return null;
                    }

                    if (credentials.password !== user.PassWord) {
                        console.log("Invalid password");
                        return null;
                    }

                    return {
                        id: user.id,
                        username: user.UserName,
                        name: user.UserName
                    };
                } catch (error) {
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
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
