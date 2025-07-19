import 'next-auth/jwt';
import 'next-auth';
import type { Role } from './types';


declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: Role;
      permissions: string[];
      name: string;
      email: string;
      avatar: string;
      resellerId?: number | string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: Role;
    permissions: string[];
    resellerId?: number | string;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: Role;
    permissions: string[];
    resellerId?: number | string;
  }
}