import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assign-bin-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './assign-bin-modal.component.html',
  styleUrl: './assign-bin-modal.component.scss'
})
export class AssignBinModalComponent {
  @Input() selectedCount = 0;
  @Output() assigned = new EventEmitter<number>();
  @Output() closed = new EventEmitter<void>();

  binNumber = 1;

  get binOptions(): number[] {
    return Array.from({ length: 100 }, (_, i) => i + 1);
  }

  submit() {
    this.assigned.emit(this.binNumber);
  }
}
