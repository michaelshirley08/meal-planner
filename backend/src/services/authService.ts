import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/client';

const JWT_EXPIRY: string = process.env.JWT_EXPIRY || '7d';

/**
 * Get JWT secret from environment or use default
 */
const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key-change-this';
  return secret;
};

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(userId: number): string {
  // JWT_EXPIRY is a string like '7d' which is valid for jsonwebtoken's expiresIn option
  // Cast to unknown first to bypass strict type checking, then cast to object
  return jwt.sign(
    { userId },
    getJwtSecret(),
    ({ expiresIn: JWT_EXPIRY } as unknown) as object
  );
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): { userId: number } | null {
  try {
    return jwt.verify(token, getJwtSecret()) as { userId: number };
  } catch {
    return null;
  }
}

/**
 * Register a new user
 */
export async function registerUser(
  email: string,
  username: string,
  password: string
): Promise<{ user: { id: number; email: string; username: string }; token: string }> {
  // Check if user exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }]
    }
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error('Email already registered');
    }
    if (existingUser.username === username) {
      throw new Error('Username already taken');
    }
  }

  // Hash password and create user
  const hashedPassword = await hashPassword(password);
  const newUser = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword
    }
  });

  const token = generateToken(newUser.id);

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username
    },
    token
  };
}

/**
 * Login user
 */
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: { id: number; email: string; username: string }; token: string }> {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid email or password');
  }

  const token = generateToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username
    },
    token
  };
}
