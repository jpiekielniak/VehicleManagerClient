import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AccordionModule } from "primeng/accordion";
import { CardModule } from "primeng/card";

interface FAQItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCardModule,
    MatIconModule,
    AccordionModule,
    CardModule
  ],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {
  faqs: FAQItem[] = [
    {
      question: 'Kto jest autorem projektu?',
      answer: 'Autorem projektu jest Jakub Piekielniak. Projekt został wykonany w ramach pracy dyplomowej na Akademii Tarnowskiej. Promotorem pracy jest mgr inż. Tomasz Gądek.'
    },
    {
      question: 'Jakie technologie zostały użyte w projekcie?',
      answer: 'Projekt został zrealizowany z wykorzystaniem nowoczesnych technologii. Backend został napisany w C# z użyciem platformy .NET. Frontend został stworzony przy użyciu frameworka Angular. Do przechowywania danych wykorzystano bazę PostgreSQL, a zdjęcia są przechowywane w Azure Blob Storage.'
    },
    {
      question: 'Jakie możliwości oferuje aplikacja?',
      answer: 'Aplikacja umożliwia użytkownikom kompleksowe zarządzanie swoimi pojazdami. Główne usługi to prowadzenie elektronicznej książki serwisowej oraz system przypomnień o wygasających ubezpieczeniach i zbliżających się przeglądach technicznych.'
    },
    {
      question: 'Dlaczego warto korzystać z naszej aplikacji?',
      answer: 'Nasza aplikacja oferuje wygodne i intuicyjne narzędzie do zarządzania pojazdami. Dzięki funkcji przypomnień, użytkownicy nigdy nie zapomną o ważnych terminach związanych z ich pojazdami. Elektroniczna książka serwisowa pozwala na łatwe śledzenie historii napraw i przeglądów.'
    },
    {
      question: 'Czy aplikacja jest bezpieczna?',
      answer: 'Tak, bezpieczeństwo danych użytkowników jest naszym priorytetem. Wykorzystujemy nowoczesne technologie i najlepsze praktyki w zakresie bezpieczeństwa aplikacji webowych. Dane są przechowywane w bezpieczny sposób, a dostęp do nich jest odpowiednio chroniony.'
    },
    {
      question: 'Jakie są plany rozwoju aplikacji?',
      answer: 'Aplikacja będzie stale rozwijana, poprzez dodawanie nowych możliwości i ulepszanie już istniejących. W najbliższej przyszłości planowane jest wprowadzenie m.in. intergracji z popularnymi portalami społecznościowymi, możliwość generowania raportów i wiele innych udogodnień....'
    }
  ];
}
