import { Role } from './user';

export interface PatientRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface DoctorRegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specialty: string;
  languages: string[];
  yearsExperience: number | null;
  bio: string | null;
  timezone: string;
}
