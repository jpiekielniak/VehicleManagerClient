import { Component } from '@angular/core';
import {RouterOutlet, RouterLink} from "@angular/router";
import { MatTab, MatTabGroup } from "@angular/material/tabs";
import { NgIf } from "@angular/common";
import { SignUpComponent } from "../sign-up/sign-up.component";
import {SignInComponent} from "../sign-in/sign-in.component";

@Component({
  selector: 'app-auth',
  standalone: true,
  templateUrl: './auth.component.html',
  imports: [
    MatTabGroup,
    MatTab,
    NgIf,
    SignUpComponent,
    RouterOutlet,
    RouterLink,
    SignInComponent
  ],
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
}
