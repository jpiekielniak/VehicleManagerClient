import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-vehicle-image',
  standalone: true,
  imports: [],
  templateUrl: './vehicle-image.component.html',
  styleUrl: './vehicle-image.component.css'
})
export class VehicleImageComponent {
  @Input() imageUrl!: string;

  get validImageUrl(): string {
    return this.imageUrl && this.imageUrl.trim()
      ? this.imageUrl
      : '/assets/no_image.png';
  }
}
