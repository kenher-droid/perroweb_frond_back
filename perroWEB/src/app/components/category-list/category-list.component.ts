import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent {
  @Input() categories: Category[] = [];
}
