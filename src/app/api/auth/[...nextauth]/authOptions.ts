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
          // Assume `user` response contains both `id` and `token`
          return { id: user._id, token: user.token }; // Return both id and token
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
        token.id = user.id; // Store the id in the token
        token.token = user.token; // Store the token in the token
      }
      return token;
    },
    async session({ session, token }) {
      session.user._id = String(token.id); // Assign the id to the session
      session.user.token = String(token.token); // Assign the token to the session
      console.log(session.user.token); // Log the token
      return session;
    }
  }
};