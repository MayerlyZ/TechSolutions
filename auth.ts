import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import dbConnect from './src/app/lib/mongoose'; 
import UserModel from './models/User';   
import type { User } from './src/app/lib/definitions';
import mongoose from 'mongoose';

interface MongooseLeanUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role?: string;
  password?: string; 
}


async function getUser(email: string): Promise<User | undefined> {
  try {
    await dbConnect();

        const user = await UserModel.findOne({ email: email })
          .select('+password')
          .lean<MongooseLeanUser>(); // Explicitly cast to MongooseLeanUser
        if (!user) {
          return undefined;
        }
   
        if (!user._id || !user.name || !user.email || !user.password) {
            return undefined;
        }
    
    const finalUser: User = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role || 'customer',
    };
    return finalUser;  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          
          const user = await getUser(email);
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return user;
          }
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});