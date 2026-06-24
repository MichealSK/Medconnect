import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, catchError, of, BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';
import { ForumCategory, ForumPostSummary, PageResponse, CATEGORY_LABELS } from '../../models/forum';
import { ForumService } from '../../services/posts';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { AvatarComponent } from '../../ui/avatar';
import {
  heroPlus,
  heroMagnifyingGlass,
  heroXMark,
  heroChatBubbleOvalLeft,
  heroHeart,
  heroCheckBadge,
} from '@ng-icons/heroicons/outline';
import { heroHeartSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-forum',
  providers: [
    provideIcons({
      heroPlus,
      heroMagnifyingGlass,
      heroXMark,
      heroChatBubbleOvalLeft,
      heroCheckBadge,
      heroHeart,
      heroHeartSolid,
    }),
  ],
  imports: [RouterLink, FormsModule, NgIcon, AvatarComponent, TitleCasePipe],
  host: { class: 'block' },

  templateUrl: './forum.html',
})
export class ForumComponent {
  private readonly forumService = inject(ForumService);

  readonly allCategories: (ForumCategory | null)[] = [
    null,
    'GENERAL_HEALTH',
    'MENTAL_HEALTH',
    'NUTRITION',
    'FITNESS',
    'CHRONIC_CONDITIONS',
    'MEDICATIONS',
  ];

  readonly writableCategories = Object.entries(CATEGORY_LABELS) as [ForumCategory, string][];
  readonly categoryLabels = CATEGORY_LABELS;

  selectedCategory = signal<ForumCategory | null>(null);
  currentPage = signal(0);
  searchQuery = signal('');
  showNewPostModal = signal(false);
  newPostTitle = signal('');
  newPostContent = signal('');
  newPostCategory = signal<ForumCategory>('GENERAL_HEALTH');
  isSubmitting = signal(false);

  private searchDebounce: ReturnType<typeof setTimeout> | null = null;
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  readonly postsPage = toSignal(
    this.refresh$.pipe(
      switchMap(() =>
        this.forumService
          .getPosts(
            this.selectedCategory(),
            this.currentPage(),
            10,
            this.searchQuery() || undefined,
          )
          .pipe(catchError(() => of(null))),
      ),
    ),
    { initialValue: null as PageResponse<ForumPostSummary> | null },
  );

  readonly filteredPosts = computed(() => this.postsPage()?.content ?? []);

  readonly totalPages = computed(() => this.postsPage()?.totalPages ?? 0);
  readonly pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i));
  readonly canSubmit = computed(
    () => this.newPostTitle().trim().length > 0 && this.newPostContent().trim().length > 0,
  );

  private refresh() {
    this.refresh$.next();
  }

  onSearchChange(value: string) {
    this.searchQuery.set(value);
    if (this.searchDebounce) clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => {
      this.currentPage.set(0);
      this.refresh();
    }, 400);
  }

  selectCategory(category: ForumCategory | null) {
    this.selectedCategory.set(category);
    this.currentPage.set(0);
    this.refresh();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.refresh();
  }

  categoryLabel(cat: ForumCategory | null): string {
    return cat ? CATEGORY_LABELS[cat] : 'All Topics';
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

  openModal() {
    this.showNewPostModal.set(true);
  }

  closeModal() {
    this.showNewPostModal.set(false);
    this.newPostTitle.set('');
    this.newPostContent.set('');
    this.newPostCategory.set('GENERAL_HEALTH');
  }

  submitPost() {
    if (!this.canSubmit() || this.isSubmitting()) return;
    this.isSubmitting.set(true);
    this.forumService
      .createPost({
        title: this.newPostTitle().trim(),
        content: this.newPostContent().trim(),
        category: this.newPostCategory(),
      })
      .pipe(catchError(() => of(null)))
      .subscribe(() => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.refresh();
      });
  }

  toggleLike(postId: string, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.forumService
      .togglePostLike(postId)
      .pipe(catchError(() => of(null)))
      .subscribe(() => this.refresh());
  }
}
