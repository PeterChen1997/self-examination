import NextAuth from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export { getServerSession };
export const { auth, signIn, signOut } = NextAuth(authOptions);

// 向后兼容 NextAuth v4
export default NextAuth(authOptions);
