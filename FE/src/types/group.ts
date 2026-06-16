export interface Group {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface CreateGroupInput {
  name: string;
  description?: string;
}
