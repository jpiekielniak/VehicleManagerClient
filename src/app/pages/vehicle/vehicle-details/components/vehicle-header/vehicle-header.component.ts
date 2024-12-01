import {Component, Input} from '@angular/core';
import {Button} from "primeng/button";
import {MenuModule} from "primeng/menu";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-vehicle-header',
  standalone: true,
  imports: [
    Button,
    MenuModule
  ],
  templateUrl: './vehicle-header.component.html',
  styleUrl: './vehicle-header.component.css'
})
export class VehicleHeaderComponent {
  @Input() items: MenuItem[] | undefined = [];
}
