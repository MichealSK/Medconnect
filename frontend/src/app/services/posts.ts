import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environments } from '../../environments/environment';
import { ForumCategory, ForumPostDetail, ForumPostSummary, PageResponse } from '../models/forum';

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environments.apiUrl}/forum`;

  getPosts(category?: ForumCategory | null, page: number = 0, size: number = 20, search?: string) {
    let params = new HttpParams().set('page', page).set('size', size);
    if (category) params = params.set('category', category);
    if (search) params = params.set('search', search);
    return this.http.get<PageResponse<ForumPostSummary>>(`${this.baseUrl}/posts`, { params });
  }

  getPostById(id: string) {
    return this.http.get<ForumPostDetail>(`${this.baseUrl}/posts/${id}`);
  }

  createPost(request: { title: string; content: string; category: ForumCategory }) {
    return this.http.post<ForumPostSummary>(`${this.baseUrl}/posts`, request);
  }

  togglePostLike(postId: string) {
    return this.http.post<{ liked: boolean }>(`${this.baseUrl}/posts/${postId}/like`, {});
  }

  deletePost(postId: string) {
    return this.http.delete<void>(`${this.baseUrl}/posts/${postId}`);
  }

  addComment(postId: string, content: string, parentCommentId?: string) {
    return this.http.post(`${this.baseUrl}/posts/${postId}/comments`, {
      content,
      parentCommentId: parentCommentId ?? null,
    });
  }

  toggleCommentLike(commentId: string) {
    return this.http.post<{ liked: boolean }>(`${this.baseUrl}/comments/${commentId}/like`, {});
  }

  deleteComment(commentId: string) {
    return this.http.delete<void>(`${this.baseUrl}/comments/${commentId}`);
  }
  getMyPosts() {
    return this.http.get<ForumPostSummary[]>(`${this.baseUrl}/activity/my-posts`);
  }

  getCommentedPosts() {
    return this.http.get<ForumPostSummary[]>(`${this.baseUrl}/activity/commented`);
  }

  getLikedPosts() {
    return this.http.get<ForumPostSummary[]>(`${this.baseUrl}/activity/liked`);
  }
}
