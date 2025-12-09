
export type User = {
  id: string;
  name: string;
  email: string;
  password: string; // Hashed password
  role?: string; // admin or customer
};