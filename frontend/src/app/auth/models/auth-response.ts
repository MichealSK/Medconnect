import { Role } from './user';

export interface AuthResponse {
  accessToken: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
}
