// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      _id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    _id?: string;
    isAdmin?: boolean;
  }
}
