// app/api/auth/[...nextauth]/route.js
import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "../../../../lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

// Extend the Session type to include id on user
declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions : NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials : {email : string, password : string}| undefined) : Promise<{id : string, name : string, email : string}> {
        if(!credentials){
            throw new Error("Missing credentials");
        }
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found with this email");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return { id: user._id, name: user.name, email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks : {
    async session({ session, token, user }) {
    // Add user ID to session object
    if(session.user) session.user.id = token.sub;
    return session;
  },
  },
  pages : {
    signIn : '/signin'
  }
};

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };