import {Component} from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {CommonModule} from "@angular/common";
import {NavbarComponent} from "./shared/components/nav-bar/nav-bar.component";
import {ScrollToTopComponent} from "./shared/components/scroll-to-top/scroll-to-top.component";
import {FooterComponent} from "./shared/components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, ToastModule, NavbarComponent, ScrollToTopComponent, FooterComponent],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Menedżer pojazdów';
}
