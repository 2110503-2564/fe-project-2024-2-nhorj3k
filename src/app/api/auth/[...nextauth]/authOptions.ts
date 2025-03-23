import userLogIn from "@/libs/userLogIn";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        const user = await userLogIn(credentials.email, credentials.password);
        
        if (user) {
          return { id: user._id, token: user.token, role: user.role }; 
        } else {
          return null;
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.token = user.token;
        token.role = user.role;  // ✅ Store role in token
      }
      return token;
    },
    async session({ session, token }) {
      session.user._id = String(token.id);
      session.user.token = String(token.token);
      session.user.role = String(token.role); // ✅ Assign role to session
      console.log(session.user.role); // Debugging: Log role
      return session;
    }
  }
};