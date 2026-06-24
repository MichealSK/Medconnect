import { Component, inject, signal, computed } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { DoctorsService } from '../../services/doctors';
import { DoctorsPage, EMPTY_PAGE } from '../../models/doctor';
import { SearchDoctorCardComponent } from '../../ui/search-doctor-card';
import { provideIcons, NgIcon } from '@ng-icons/core';
import {
  heroMagnifyingGlass,
  heroChevronLeft,
  heroChevronRight,
} from '@ng-icons/heroicons/outline';
const SPECIALTIES = [
  'General Practice',
  'Cardiology',
  'Neurology',
  'Dermatology',
  'Psychiatry',
  'Orthopedics',
  'Pediatrics',
  'Gynecology',
];

const LANGUAGES = ['English', 'French', 'German', 'Spanish', 'Arabic', 'Hindi'];

@Component({
  selector: 'app-doctors',
  imports: [RouterModule, FormsModule, SearchDoctorCardComponent, NgIcon],
  providers: [provideIcons({ heroMagnifyingGlass, heroChevronLeft, heroChevronRight })],
  templateUrl: './doctors.html',
})
export class DoctorsComponent {
  private doctorsService = inject(DoctorsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  specialties = SPECIALTIES;
  languages = LANGUAGES;

  searchQuery = signal('');
  selectedSpecialties = signal<string[]>([]);
  selectedLanguages = signal<string[]>([]);
  currentPage = signal(0);

  constructor() {
    const params = this.route.snapshot.queryParams;
    if (params['specialty']) this.selectedSpecialties.set([params['specialty']]);
    if (params['language']) this.selectedLanguages.set([params['language']]);
  }

  private params$ = combineLatest([
    toObservable(this.searchQuery).pipe(debounceTime(300), distinctUntilChanged()),
    toObservable(this.selectedSpecialties),
    toObservable(this.selectedLanguages),
    toObservable(this.currentPage),
  ]);

  result = toSignal(
    this.params$.pipe(
      switchMap(([query, specialties, languages, page]) =>
        this.doctorsService.getAllPageable(
          specialties[0],
          languages[0],
          query || undefined,
          page,
          9,
        ),
      ),
    ),
    { initialValue: EMPTY_PAGE as DoctorsPage },
  );

  doctors = computed(() => this.result()?.content ?? []);
  totalPages = computed(() => this.result()?.totalPages ?? 0);
  isLoading = computed(() => !this.result()?.content?.length && this.result()?.totalElements === 0);
  pageNumbers = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  toggleSpecialty(s: string) {
    this.selectedSpecialties.update((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
    this.currentPage.set(0);
  }

  toggleLanguage(l: string) {
    this.selectedLanguages.update((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l],
    );
    this.currentPage.set(0);
  }

  onSearch(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(0);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedSpecialties.set([]);
    this.selectedLanguages.set([]);
    this.currentPage.set(0);
    this.router.navigate([], { queryParams: {} }).then(()=>{});
  }

  goToPage(page: number) {
    this.currentPage.set(page - 1);
  }
  prevPage() {
    this.currentPage.update((p) => Math.max(0, p - 1));
  }
  nextPage() {
    this.currentPage.update((p) => Math.min(this.totalPages() - 1, p + 1));
  }
}
