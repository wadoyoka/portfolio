import DataFetcher from '@/lib/DateFether';
import { CryptoUtils } from '@/utils/crypto-utils';
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
                    const hashedUserName = await CryptoUtils.base64Encode(credentials.username);
                    console.log(hashedUserName)

                    const users = await DataFetcher(hashedUserName) as FirestoreUser[];
                    console.log(users);
                    const user = users[0]
                    if (!user) {
                        console.log("User not found");
                        return null;
                    }

                    const base64EncodedInputPass = await CryptoUtils.base64Encode(credentials.password);
                    const secretUnion = base64EncodedInputPass + (process.env.SECRET_LOGIN_PASS_KEY as string);
                    const sha256HashedInputPass = await CryptoUtils.sha256Hash(secretUnion);
                    const ispass = await CryptoUtils.comparePassword(sha256HashedInputPass, user.PassWord);
                    console.log('ispass\t'+ispass)

                    if (!ispass) {
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
