export enum Role {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR'
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  emailVerified: boolean;
}
