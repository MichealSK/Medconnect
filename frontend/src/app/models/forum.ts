export type ForumCategory =
  | 'GENERAL_HEALTH'
  | 'MENTAL_HEALTH'
  | 'NUTRITION'
  | 'FITNESS'
  | 'CHRONIC_CONDITIONS'
  | 'MEDICATIONS';

export interface ForumPostSummary {
  id: string;
  title: string;
  content: string;
  category: ForumCategory;
  authorName: string;
  authorRole: 'PATIENT' | 'DOCTOR';
  likesCount: number;
  likedByMe: boolean;
  commentCount: number;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export const CATEGORY_LABELS: Record<ForumCategory, string> = {
  GENERAL_HEALTH: 'General Health',
  MENTAL_HEALTH: 'Mental Health',
  NUTRITION: 'Nutrition',
  FITNESS: 'Fitness',
  CHRONIC_CONDITIONS: 'Chronic Conditions',
  MEDICATIONS: 'Medications',
};

export interface ForumReply {
  id: string;
  content: string;
  authorName: string;
  authorRole: 'PATIENT' | 'DOCTOR';
  likesCount: number;
  likedByMe: boolean;
  isOwner: boolean;
  createdAt: string;
}

export interface ForumComment {
  id: string;
  content: string;
  authorName: string;
  authorRole: 'PATIENT' | 'DOCTOR';
  likesCount: number;
  likedByMe: boolean;
  isOwner: boolean;
  createdAt: string;
  replies: ForumReply[];
}

export interface ForumPostDetail {
  id: string;
  title: string;
  content: string;
  category: ForumCategory;
  authorName: string;
  authorRole: 'PATIENT' | 'DOCTOR';
  likesCount: number;
  likedByMe: boolean;
  isOwner: boolean;
  createdAt: string;
  comments: ForumComment[];
}
