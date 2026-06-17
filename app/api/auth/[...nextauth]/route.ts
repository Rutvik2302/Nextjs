import NextAuth from "next-auth";
import { authOptions } from "./options";

const hendler =NextAuth(authOptions)

export {hendler as GET , hendler as POST}