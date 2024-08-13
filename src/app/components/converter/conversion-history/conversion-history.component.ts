import { Component, Input } from '@angular/core';
import { ConversionHistory } from '../../../models/conversion-history';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversion-history',
  templateUrl: './conversion-history.component.html', 
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./conversion-history.component.scss']
})
export class ConversionHistoryComponent {
  @Input() history: ConversionHistory[] = [];
}

