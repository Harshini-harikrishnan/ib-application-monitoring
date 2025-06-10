// Authentication utilities and API helpers

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    age: number;
    state: string;
    city: string;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
    lastLogin: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface SignupRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    age: string;
    state: string;
    city: string;
    password: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    token?: string;
    user?: User;
    message?: string;
  }
  
  // API Base URL - Update this to match your .NET backend
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7001/api';
  
  export class AuthService {
    static async login(credentials: LoginRequest): Promise<AuthResponse> {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
  
        const data = await response.json();
        
        if (response.ok) {
          // Store token in localStorage
          if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
          }
          return data;
        } else {
          throw new Error(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    }
  
    static async signup(userData: SignupRequest): Promise<AuthResponse> {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Signup failed');
        }
        
        return data;
      } catch (error) {
        console.error('Signup error:', error);
        throw error;
      }
    }
  
    static async forgotPassword(email: string): Promise<AuthResponse> {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to send reset email');
        }
        
        return data;
      } catch (error) {
        console.error('Forgot password error:', error);
        throw error;
      }
    }
  
    static async resetPassword(token: string, newPassword: string): Promise<AuthResponse> {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, newPassword }),
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Password reset failed');
        }
        
        return data;
      } catch (error) {
        console.error('Reset password error:', error);
        throw error;
      }
    }
  
    static async verifyEmail(token: string): Promise<AuthResponse> {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Email verification failed');
        }
        
        return data;
      } catch (error) {
        console.error('Email verification error:', error);
        throw error;
      }
    }
  
    static getToken(): string | null {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
      }
      return null;
    }
  
    static getUser(): User | null {
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
      }
      return null;
    }
  
    static logout(): void {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
  
    static isAuthenticated(): boolean {
      return !!this.getToken();
    }
  
    // Helper method to add auth headers to API requests
    static getAuthHeaders(): Record<string, string> {
      const token = this.getToken();
      return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };
    }
  }