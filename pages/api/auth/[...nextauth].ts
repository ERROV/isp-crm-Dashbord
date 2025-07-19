
import NextAuth, { type AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { initialUsers, initialRoles } from '../../../lib/mockData';
import type { Role as IRole } from '../../../types';

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
            return null;
        }

        const user = initialUsers.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
        
        if (!user) {
          throw new Error('No user found with this email.');
        }

        const role = initialRoles.find(r => r.id === user.roleId);

        if (!role) {
            throw new Error('User role not found.');
        }
        
        // For mock data, we don't check the password.
        
        // Return the user object to be encoded in the JWT
        return { 
            id: user.id!.toString(), 
            email: user.email, 
            name: user.name,
            avatar: user.avatar,
            role: role, 
            permissions: role.permissions,
            resellerId: user.resellerId
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // The user object is only passed on the first sign-in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.avatar = user.avatar;
        token.role = user.role;
        token.permissions = user.permissions;
        token.resellerId = user.resellerId;
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom properties to the session object
      if (token && session.user) {
        session.user = {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          avatar: token.avatar as string,
          role: token.role as IRole,
          permissions: token.permissions as string[],
          resellerId: token.resellerId as string | number | undefined,
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'super-secret-key-for-development',
  pages: {
    signIn: '/auth/login',
  },
};

export default NextAuth(authOptions);
