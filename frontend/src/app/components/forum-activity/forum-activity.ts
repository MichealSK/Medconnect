import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, catchError, of, BehaviorSubject } from 'rxjs';
import { ForumService } from '../../services/posts';
import { CATEGORY_LABELS, ForumPostSummary } from '../../models/forum';

type Tab = 'my-posts' | 'commented' | 'liked';

@Component({
  selector: 'app-forum-activity',
  imports: [RouterLink],
  templateUrl: './forum-activity.html',
})
export class ForumActivityComponent {
  private readonly forumService = inject(ForumService);

  readonly categoryLabels = CATEGORY_LABELS;
  activeTab = signal<Tab>('my-posts');

  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly myPosts = toSignal(
    this.refresh$.pipe(
      switchMap(() => this.forumService.getMyPosts().pipe(catchError(() => of([])))),
    ),
    { initialValue: [] as ForumPostSummary[] },
  );

  readonly commentedPosts = toSignal(
    this.refresh$.pipe(
      switchMap(() => this.forumService.getCommentedPosts().pipe(catchError(() => of([])))),
    ),
    { initialValue: [] as ForumPostSummary[] },
  );

  readonly likedPosts = toSignal(
    this.refresh$.pipe(
      switchMap(() => this.forumService.getLikedPosts().pipe(catchError(() => of([])))),
    ),
    { initialValue: [] as ForumPostSummary[] },
  );

  readonly tabs = [
    { id: 'my-posts' as Tab, label: 'My Posts' },
    { id: 'commented' as Tab, label: 'Commented' },
    { id: 'liked' as Tab, label: 'Liked' },
  ];

  activePosts() {
    switch (this.activeTab()) {
      case 'my-posts':
        return this.myPosts();
      case 'commented':
        return this.commentedPosts();
      case 'liked':
        return this.likedPosts();
    }
  }

  activeCount(tab: Tab): number {
    switch (tab) {
      case 'my-posts':
        return this.myPosts().length;
      case 'commented':
        return this.commentedPosts().length;
      case 'liked':
        return this.likedPosts().length;
    }
  }

  setTab(tab: Tab) {
    this.activeTab.set(tab);
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
