import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../core/api.service';
import { Deviation } from '../../../models';

@Component({
  selector: 'app-deviations-list',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './deviations-list.component.html',
  styleUrl: './deviations-list.component.scss'
})
export class DeviationsListComponent {
  deviations: Deviation[] = [];

  constructor(private api: ApiService) {
    this.api.getDeviations().subscribe(list => this.deviations = list);
  }

  markRead(d: Deviation) {
    if (d.read) return;
    this.api.markDeviationRead(d.id).subscribe(() => {
      d.read = true;
    });
  }
}
