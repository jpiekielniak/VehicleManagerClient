import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {MenuItem} from "primeng/api";
import {TabMenuModule} from "primeng/tabmenu";
import {Button} from "primeng/button";
import {MenuModule} from "primeng/menu";
import {AuthService} from "../../../pages/auth/shared/services/auth.service";
import {combineLatest, Subscription} from "rxjs";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    TabMenuModule,
    Button,
    MenuModule,
    CommonModule
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];
  activeItem: MenuItem | undefined;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private subscriptions = new Subscription();
  private readonly baseItems: MenuItem[] = [
    {
      label: 'Moje pojazdy',
      icon: 'pi pi-car',
      routerLink: ['/moje-pojazdy']
    },
    {
      label: 'O nas',
      icon: 'pi pi-info-circle',
      routerLink: ['/informacje-o-aplikacji']
    },
    {
      label: 'Kontakt',
      icon: 'pi pi-envelope',
      routerLink: ['/kontakt']
    }
  ];

  ngOnInit() {
    this.initializeNavigation();
    this.setupAuthSubscription();
  }

  private initializeNavigation() {
    this.items = [...this.baseItems];
    this.activeItem = this.items[0];
  }

  private setupAuthSubscription() {
    this.subscriptions.add(
      combineLatest([
        this.authService.authStateChanged(),
        this.authService.isAdmin()
      ]).subscribe(([isLoggedIn, isAdmin]) => {
        this.updateNavigationItems(isLoggedIn, isAdmin);
        this.updateUserMenu(isLoggedIn);
      })
    );
  }

  private updateNavigationItems(isLoggedIn: boolean, isAdmin: boolean) {
    this.items = [...this.baseItems];

    if (isLoggedIn && isAdmin) {
      this.items.push({
        label: 'Panel Administratora',
        icon: 'pi pi-cog',
        routerLink: ['/panel-administracyjny']
      });
    }
  }

  private updateUserMenu(isLoggedIn: boolean) {
    if (isLoggedIn) {
      this.userMenuItems = [
        {
          label: 'Moje konto',
          icon: 'pi pi-user',
          routerLink: ['/moje-konto']
        }
      ];

      this.userMenuItems.push(
        {separator: true},
        {
          label: 'Wyloguj',
          icon: 'pi pi-sign-out',
          styleClass: 'logout-item',
          command: () => this.handleLogout()
        }
      );
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

  private async handleLogout() {
    await this.authService.signOut();
    this.items = [...this.baseItems];
    this.activeItem = this.items[0];
    await this.router.navigate(['/logowanie']);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
