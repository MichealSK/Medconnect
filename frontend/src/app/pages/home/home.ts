import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { Hero } from '../../components/hero/hero';
import { HowItWorks } from '../../components/how-it-works/how-it-works';
import { SpecialtiesGrid } from '../../components/specialties-grid/specialties-grid';
import { StatsBar } from '../../components/stats-bar/stats-bar';
import { Cta } from '../../components/cta/cta';

@Component({
  selector: 'app-home',
  imports: [Footer, Hero, HowItWorks, SpecialtiesGrid, StatsBar, Cta],
  templateUrl: './home.html',
})
export class Home {}
