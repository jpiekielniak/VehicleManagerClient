import {Component, Input} from '@angular/core';
import {MenuModule} from "primeng/menu";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-vehicle-header',
  standalone: true,
  imports: [
    MenuModule
  ],
  templateUrl: './vehicle-header.component.html',
  styleUrl: './vehicle-header.component.css'
})
export class VehicleHeaderComponent {
  @Input() items: MenuItem[] | undefined = [];
  @Input() vehicle: any;
}
