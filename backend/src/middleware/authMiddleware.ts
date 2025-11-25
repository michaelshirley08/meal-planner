import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';

/**
 * Extend Express Request to include userId
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

/**
 * Middleware to verify JWT token and extract userId
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return;
  }

  const token = authHeader.slice(7); // Remove "Bearer " prefix
  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  req.userId = decoded.userId;
  next();
}

/**
 * Error handler middleware
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response
): void {
  console.error(err);

  if (!(err instanceof Error)) {
    res.status(500).json({ error: 'Internal server error' });
    return;
  }

  // Check if error already has a status code (e.g., from body-parser)
  const errWithStatus = err as Error & { status?: number; statusCode?: number };
  const statusCode = errWithStatus.status || errWithStatus.statusCode;
  if (statusCode) {
    res.status(statusCode).json({
      error: err.message || 'Bad request',
    });
    return;
  }

  // Handle application-specific errors
  if (err.message.includes('Email already registered') || err.message.includes('already taken')) {
    res.status(400).json({ error: err.message });
    return;
  }

  if (err.message.includes('Invalid email or password')) {
    res.status(401).json({ error: err.message });
    return;
  }

  // Default to 500 for unexpected errors
  res.status(500).json({ error: 'Internal server error' });
}
