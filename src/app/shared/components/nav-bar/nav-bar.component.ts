import {Component, OnDestroy, OnInit} from '@angular/core';
import {MenuItem} from "primeng/api";
import {TabMenuModule} from "primeng/tabmenu";
import {Button} from "primeng/button";
import {MenuModule} from "primeng/menu";
import {AuthService} from "../../../pages/auth/shared/services/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    TabMenuModule,
    Button,
    MenuModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];
  activeItem: MenuItem | undefined;
  private authSubscription?: Subscription;


  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.initializeMainMenu();
    this.getUserMenuItems(this.authService.isLoggedIn());

    this.authSubscription = this.authService.authStateChanged().subscribe(
      (isLoggedIn: boolean) => {
        this.getUserMenuItems(isLoggedIn);
      }
    );
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private initializeMainMenu() {
    this.items = [
      {
        label: 'Moje pojazdy',
        icon: 'pi pi-car',
        routerLink: ['/moje-pojazdy']
      },
      {
        label: 'O nas',
        icon: 'pi pi-info-circle',
        routerLink: ['/info']
      },
      {
        label: 'Kontakt',
        icon: 'pi pi-envelope',
        routerLink: ['/kontakt']
      }
    ];

    this.activeItem = this.items[0];
  }

  private getUserMenuItems(isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.userMenuItems = [
        {
          label: 'Moje konto',
          icon: 'pi pi-user',
          routerLink: ['/moje-konto']
        },
        {
          separator: true
        },
        {
          label: 'Wyloguj',
          icon: 'pi pi-sign-out',
          command: () => this.logout()
        }
      ];
    } else {
      this.userMenuItems = [
        {
          label: 'Zaloguj się',
          icon: 'pi pi-sign-in',
          routerLink: ['/logowanie']
        },
        {
          label: 'Zarejestruj się',
          icon: 'pi pi-user-plus',
          routerLink: ['/rejestracja']
        }
      ];
    }
  }

  async logout() {
    await this.authService.signOut().then(() => window.location.reload());
  }
}
