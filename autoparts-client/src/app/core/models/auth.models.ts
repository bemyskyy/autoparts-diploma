export interface AuthRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  token: string;
}

export interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
  role?: string;
}

export interface User {
  id: number;
  phone: string;
  firstName: string;
  lastName: string;
  role: string;
  balance: number;
}
