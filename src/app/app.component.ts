import {Component} from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {AlertModule} from "@coreui/angular";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, AlertModule, RouterOutlet, RouterModule, ToastModule],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Menadżer pojazdów';
}
