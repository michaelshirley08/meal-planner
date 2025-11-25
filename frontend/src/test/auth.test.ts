import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '../services/authService';
import type { AuthResponse } from '../types';

// Mock the API client
vi.mock('../services/api', () => {
  return {
    apiClient: {
      post: vi.fn(),
      get: vi.fn(),
    },
  };
});

describe('Authentication Service', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user and return properly nested user object', async () => {
      const mockResponse: AuthResponse = {
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
        },
        token: 'mock-jwt-token',
      };

      // Get the mocked apiClient
      const { apiClient } = await import('../services/api');
      const mockPost = apiClient.post as unknown as ReturnType<typeof vi.fn>;
      mockPost.mockResolvedValueOnce({ data: mockResponse });

      const result = await authService.register({
        email: 'test@example.com',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
      });

      // Verify the response has the correct structure
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('email');
      expect(result.user).toHaveProperty('username');
      expect(result.token).toBe('mock-jwt-token');

      // Verify token was stored in localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token');
    });
  });

  describe('login', () => {
    it('should login a user and return properly nested user object', async () => {
      const mockResponse: AuthResponse = {
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
        },
        token: 'mock-jwt-token',
      };

      // Get the mocked apiClient
      const { apiClient } = await import('../services/api');
      const mockPost = apiClient.post as unknown as ReturnType<typeof vi.fn>;
      mockPost.mockResolvedValueOnce({ data: mockResponse });

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      // Verify the response has the correct structure
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('email');
      expect(result.user).toHaveProperty('username');
      expect(result.token).toBe('mock-jwt-token');

      // Verify token was stored in localStorage
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token');
    });

    it('should handle login with correct password after registration', async () => {
      // This test verifies the register -> login flow
      const registerResponse: AuthResponse = {
        user: {
          id: 1,
          email: 'newuser@example.com',
          username: 'newuser',
        },
        token: 'register-token',
      };

      const loginResponse: AuthResponse = {
        user: {
          id: 1,
          email: 'newuser@example.com',
          username: 'newuser',
        },
        token: 'login-token',
      };

      const { apiClient } = await import('../services/api');
      const mockPost = apiClient.post as unknown as ReturnType<typeof vi.fn>;

      // First call is register
      mockPost.mockResolvedValueOnce({ data: registerResponse });
      // Second call is login
      mockPost.mockResolvedValueOnce({ data: loginResponse });

      // Register
      const registerResult = await authService.register({
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'testpass123',
        confirmPassword: 'testpass123',
      });

      expect(registerResult.user.email).toBe('newuser@example.com');
      expect(registerResult.token).toBe('register-token');

      // Login with same credentials
      const loginResult = await authService.login({
        email: 'newuser@example.com',
        password: 'testpass123',
      });

      expect(loginResult.user.email).toBe('newuser@example.com');
      expect(loginResult.token).toBe('login-token');

      // Both should return properly structured responses
      expect(registerResult.user).toBeDefined();
      expect(loginResult.user).toBeDefined();
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      authService.logout();
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      (localStorage.getItem as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce('test-token');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      (localStorage.getItem as unknown as ReturnType<typeof vi.fn>).mockReturnValueOnce(null);
      expect(authService.isAuthenticated()).toBe(false);
    });
  });
});
