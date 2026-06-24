import { Component, computed, inject, signal } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, catchError, of, BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CATEGORY_LABELS, ForumPostDetail } from '../../../models/forum';
import { ForumService } from '../../../services/posts';
import { BackLinkComponent } from '../../../ui/back-link';
import { ForumAuthorComponent } from '../../../ui/forum-author';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroChatBubbleOvalLeft, heroHeart, heroCheckBadge } from '@ng-icons/heroicons/outline';
import { heroHeartSolid } from '@ng-icons/heroicons/solid';
import { heroTrash } from '@ng-icons/heroicons/outline';
import { ConfirmDialogComponent } from '../../../ui/delete-confirmation-modal';
@Component({
  selector: 'app-post-detail',
  providers: [
    provideIcons({ heroHeart, heroHeartSolid, heroCheckBadge, heroChatBubbleOvalLeft, heroTrash }),
  ],
  imports: [FormsModule, BackLinkComponent, ForumAuthorComponent, NgIcon, ConfirmDialogComponent],
  templateUrl: './post-detail.html',
})
export class PostDetailComponent {
  private readonly forumService = inject(ForumService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  confirmDelete = signal<{ type: 'post' | 'comment' | 'reply'; id?: string } | null>(null);

  readonly categoryLabels = CATEGORY_LABELS;

  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly post = toSignal(
    this.refresh$.pipe(
      switchMap(() =>
        this.route.params.pipe(
          switchMap((params) =>
            this.forumService.getPostById(params['id']).pipe(catchError(() => of(null))),
          ),
        ),
      ),
    ),
    { initialValue: null as ForumPostDetail | null },
  );

  commentText = signal('');
  replyingTo = signal<string | null>(null);
  replyText = signal('');
  isSubmittingComment = signal(false);
  isSubmittingReply = signal(false);

  readonly canSubmitComment = computed(() => this.commentText().trim().length > 0);
  readonly canSubmitReply = computed(() => this.replyText().trim().length > 0);

  private refresh() {
    this.refresh$.next();
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

  togglePostLike() {
    const p = this.post();
    if (!p) return;
    this.forumService
      .togglePostLike(p.id)
      .pipe(catchError(() => of(null)))
      .subscribe(() => this.refresh());
  }

  toggleCommentLike(commentId: string) {
    this.forumService
      .toggleCommentLike(commentId)
      .pipe(catchError(() => of(null)))
      .subscribe(() => this.refresh());
  }

  startReply(commentId: string) {
    this.replyingTo.set(commentId);
    this.replyText.set('');
  }

  cancelReply() {
    this.replyingTo.set(null);
    this.replyText.set('');
  }

  submitComment() {
    const p = this.post();
    if (!this.canSubmitComment() || !p || this.isSubmittingComment()) return;
    this.isSubmittingComment.set(true);
    this.forumService
      .addComment(p.id, this.commentText().trim())
      .pipe(catchError(() => of(null)))
      .subscribe(() => {
        this.isSubmittingComment.set(false);
        this.commentText.set('');
        this.refresh();
      });
  }

  submitReply(commentId: string) {
    const p = this.post();
    if (!this.canSubmitReply() || !p || this.isSubmittingReply()) return;
    this.isSubmittingReply.set(true);
    this.forumService
      .addComment(p.id, this.replyText().trim(), commentId)
      .pipe(catchError(() => of(null)))
      .subscribe(() => {
        this.isSubmittingReply.set(false);
        this.cancelReply();
        this.refresh();
      });
  }

  deletePost() {
    const p = this.post();
    if (!p) return;
    this.forumService
      .deletePost(p.id)
      .pipe(catchError(() => of(null)))
      .subscribe(() => this.router.navigate(['/forum']));
  }

  deleteComment(commentId: string) {
    this.forumService
      .deleteComment(commentId)
      .pipe(catchError(() => of(null)))
      .subscribe(() => this.refresh());
  }

  onConfirmDelete() {
    const action = this.confirmDelete();
    if (!action) return;
    this.confirmDelete.set(null);
    if (action.type === 'post') this.deletePost();
    else if (action.id) this.deleteComment(action.id);
  }
}
