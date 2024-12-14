import { Component } from '@angular/core';
import {Button} from "primeng/button";
import {RouterLink} from "@angular/router";
import {Ripple} from "primeng/ripple";

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    Button,
    RouterLink,
    Ripple
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

}
