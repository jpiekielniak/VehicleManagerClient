import {Component} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";

interface ContactItem {
  icon: string;
  label: string;
  value: string;
  description: string;
  link?: string;
  external?: boolean;
}

interface WorkingHours {
  day: string;
  hours: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf
  ],
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactItems: ContactItem[] = [
    {
      icon: 'pi-linkedin',
      label: 'LinkedIn',
      value: 'linkedin.com/in/jpiekielniak',
      description: 'Sprawdź mój profil zawodowy',
      link: 'https://www.linkedin.com/in/jpiekielniak/',
      external: true
    },
    {
      icon: 'pi-envelope',
      label: 'Email służbowy',
      value: 'jakubpiekielniak@icloud.com',
      description: 'Napisz do mnie w sprawach biznesowych',
      link: 'mailto:jakubpiekielniak@icloud.com'
    },
    {
      icon: 'pi-phone',
      label: 'Telefon',
      value: '+48 512 839 855',
      description: 'Dostępny w godzinach pracy',
      link: 'tel:+48512839855'
    },
    {
      icon: 'pi-github',
      label: 'GitHub',
      value: 'github.com/jpiekielniak',
      description: 'Zobacz moje projekty',
      link: 'https://github.com/jpiekielniak',
      external: true
    }
  ];

  workingHours: WorkingHours[] = [
    {day: 'Poniedziałek - Piątek', hours: '9:00 - 17:00'},
    {day: 'Sobota', hours: '10:00 - 15:00'},
    {day: 'Niedziela', hours: 'Niedostępny'}
  ];
}
