import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api.service';
import { Category } from './models/category.model';
import { Item } from './models/item.model';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { FeaturedItemsComponent } from './components/featured-items/featured-items.component';
import { RecentItemsComponent } from './components/recent-items/recent-items.component';
import { SiteFooterComponent } from './components/site-footer/site-footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    HeaderComponent,
    HeroComponent,
    CategoryListComponent,
    FeaturedItemsComponent,
    RecentItemsComponent,
    SiteFooterComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  categories: Category[] = [];
  featuredItems: Item[] = [];
  recentItems: Item[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });

    this.apiService.getItems().subscribe((items) => {
      this.featuredItems = items.slice(0, 4);
      this.recentItems = items.slice(0, 8);
    });
  }
}
