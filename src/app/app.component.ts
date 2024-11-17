import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AlertModule} from "@coreui/angular";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AlertModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'VehicleManagerClient';
}
