import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbconnect from "@/lib/dbconnect";
import UserModel from "@/model/user.model";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "Credentials",
            name: "Credentials",
            credentials: {
                email: { label: "emali", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbconnect()
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier.email },
                            { userName: credentials.identifier.userName }
                        ]
                    })
                    if (!user) {
                        throw new Error("no user fount with this email")
                    }
                    if (user.isverified) {
                        throw new Error("Plese verify your account")
                    }

                    const passwordcorrect = await bcrypt.compare(credentials.password, user.password)
                    if (!passwordcorrect) {
                        throw new Error("Password is wrong")
                    }

                    return user
                } catch (error: any) {
                    console.error(error)
                    throw error
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if(token){
                session.user._id = token?._id?.toString();
                session.user.isVerified = token?.isVerified;
                session.user.isAcceptingMessages = token?.isAcceptingMessages;
                session.user.userName = token?.userName;
            }
            return session
        },
        async jwt({ token, user }) {
            if(user){
                token._id = user?._id?.toString();
                token.isVerified = user?.isVerified;
                token.isAcceptingMessages = user?.isAcceptingMessages;
                token.userName = user?.userName;
            }
            return token
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRATE
}