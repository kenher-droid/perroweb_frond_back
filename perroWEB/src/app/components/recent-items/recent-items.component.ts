import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-recent-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-items.component.html',
  styleUrls: ['./recent-items.component.css']
})
export class RecentItemsComponent {
  @Input() items: Item[] = [];
}
