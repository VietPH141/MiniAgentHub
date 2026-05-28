export interface Role {
  id: number;
  name: string;
  description?: string | null;
}

export interface User {
  id: number;
  email: string;
  fullName?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName?: string;
  isActive: boolean;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  fullName?: string;
  isActive?: boolean;
}
