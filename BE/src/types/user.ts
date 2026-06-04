export interface CreateUserInput {
  email: string;
  password: string;
  fullName?: string | null;
  isActive?: boolean;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  fullName?: string | null;
  isActive?: boolean;
}
