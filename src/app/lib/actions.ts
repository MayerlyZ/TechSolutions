'use server';
 
import { signIn } from '../../../auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { auth } from '../../../auth';
 
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
  
  // Get the session to check the role
  const session = await auth();
  
  // Redirect based on role
  if ((session?.user as any)?.role === 'admin') {
    redirect('/admin');
  } else {
    redirect('/');
  }
}