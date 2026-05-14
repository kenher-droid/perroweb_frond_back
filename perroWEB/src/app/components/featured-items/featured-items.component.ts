import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-featured-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-items.component.html',
  styleUrls: ['./featured-items.component.css']
})
export class FeaturedItemsComponent {
  @Input() items: Item[] = [];
}
