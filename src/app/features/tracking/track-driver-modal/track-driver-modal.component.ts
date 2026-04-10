import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-track-driver-modal',
  standalone: true,
  imports: [],
  templateUrl: './track-driver-modal.component.html',
  styleUrl: './track-driver-modal.component.scss'
})
export class TrackDriverModalComponent {
  @Input() transferId = 0;
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
