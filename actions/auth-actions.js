/** @format */

'use server';

import { createAuthSession, destrySession } from '@/lib/auth';
import { hashUserPassword, verifyPassword } from '@/lib/hash';
import { craeteUser, getUserByEmail } from '@/lib/user';
import { redirect } from 'next/navigation';

export async function signup(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  let errors = {};

  if (!email.includes('@')) {
    errors.email = 'Please enter a valid email address';
  }

  if (password.trim().length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }

  if (Object.keys(errors).length > 0) return { errors };
  const hashedPassword = hashUserPassword(password);
  try {
    const id = craeteUser(email, hashedPassword);
    await createAuthSession(id);
    redirect('/training');
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return {
        errors: {
          email: 'Email already exist!',
        },
      };
    }
    throw error;
  }
}

export async function login(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  const existingUser = getUserByEmail(email);

  if (!existingUser) {
    return {
      errors: {
        email: 'could not authenticate user, please check your credentials',
      },
    };
  }
  const isValidPassword = verifyPassword(existingUser.password, password);

  if (!isValidPassword) {
    return {
      errors: {
        email: 'could not authenticate user, please check your credentials',
      },
    };
  }

  await createAuthSession(existingUser.id);
  redirect('/training');
}

export async function auth(mode, prevState, formData) {
  return mode === 'login'
    ? login(prevState, formData)
    : signup(prevState, formData);
}

export async function logout() {
  await destrySession();
  redirect('/');
}
