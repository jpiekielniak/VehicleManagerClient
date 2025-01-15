import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardModule} from 'primeng/card';
import {RippleModule} from 'primeng/ripple';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, CardModule, RippleModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactInfo = [
    {
      icon: '📧',
      type: 'E-mail',
      value: '<a href="mailto:jakubpiekielniak@icloud.com">jakubpiekielniak@icloud.com</a>'
    },
    {
      icon: '💼',
      type: 'LinkedIn',
      value: '<a href="https://www.linkedin.com/in/jpiekielniak">jpiekielniak</a>'
    },
    {
      icon: '📱',
      type: 'Telefon',
      value: '512-839-855'
    }
  ];
}
