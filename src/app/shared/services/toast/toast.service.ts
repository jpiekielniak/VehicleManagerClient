import {inject, Injectable} from '@angular/core';
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root',
  deps: [MessageService]
})
export class ToastService {
  private readonly messageService = inject(MessageService);

  showSuccess(message: string, title = 'Sukces') {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: 3000
    });
  }

  showError(message: string, title = 'Błąd') {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: 3000
    });
  }

  showInfo(message: string, title = 'Informacja') {
    this.messageService.add({
      severity: 'info',
      summary: title,
      detail: message,
      life: 3000
    });
  }

  showWarning(message: string, title = 'Ostrzeżenie') {
    this.messageService.add({
      severity: 'warn',
      summary: title,
      detail: message,
      life: 3000
    });
  }

}
