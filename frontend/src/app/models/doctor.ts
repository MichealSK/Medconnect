export interface Doctor {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  specialty: string;
  bio: string | null;
  languages: string[];
  timezone: string;
  yearsExperience: number | null;
  profilePhotoUrl: string | null;
  averageRating: number;
  reviewCount: number;
}
export interface AvailabilitySlot {
  id: string;
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}
export interface DoctorsPage {
  content: Doctor[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export const EMPTY_PAGE: DoctorsPage = {
  content: [],
  totalElements: 0,
  totalPages: 0,
  number: 0,
};
