import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {SignInComponent} from "../sign-in/sign-in.component";
import {SignUpComponent} from "../sign-up/sign-up.component";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  standalone: true,
  imports: [
    MatTabGroup,
    SignInComponent,
    MatTab,
    SignUpComponent
  ],
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  selectedTabIndex = 1;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      const currentPath = url[0]?.path;
      this.selectedTabIndex = currentPath === 'rejestracja' ? 1 : 0;
    });
  }

  onTabChange(index: number): void {
    const path = index === 1 ? 'rejestracja' : 'logowanie';
    this.router.navigate([`/${path}`]);
  }
}
