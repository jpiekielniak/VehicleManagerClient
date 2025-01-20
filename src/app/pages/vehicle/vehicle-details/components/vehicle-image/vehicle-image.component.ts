import {Component, ElementRef, inject, Input, ViewChild} from '@angular/core';
import {FileUploadModule} from "primeng/fileupload";
import {ButtonModule} from "primeng/button";
import {NgIf} from "@angular/common";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {VehicleService} from "../../../services/vehicle/vehicle.service";
import {ToastService} from "../../../../../shared/services/toast/toast.service";
import {LoadingSpinnerComponent} from "../../../../../shared/components/loading-spinner/loading-spinner.component";

interface UploadResponse {
  blobUrl?: string;
}

@Component({
  selector: 'app-vehicle-image',
  standalone: true,
  imports: [
    FileUploadModule,
    ButtonModule,
    NgIf,
    ProgressSpinnerModule,
    LoadingSpinnerComponent
  ],
  providers: [ToastService],
  templateUrl: './vehicle-image.component.html',
  styleUrl: './vehicle-image.component.css'
})
export class VehicleImageComponent {
  @Input() imageUrl!: string;
  @Input() vehicleId!: string;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('initialFileInput') initialFileInput!: ElementRef;

  private readonly vehicleService = inject(VehicleService);
  private readonly toastService = inject(ToastService);

  isLoading = false;
  showControls = false;
  isDragging = false;

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  handleDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.uploadFile(file);
    }
  }

  triggerFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  }

  private uploadFile(file: File) {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', file, file.name);

    this.vehicleService.uploadImage(formData, this.vehicleId)
      .subscribe({
        next: (response: UploadResponse) => {
          this.isLoading = false;
          this.imageUrl = response.blobUrl!;
          this.handleSuccessUpload();
        },
        error: () => {
          this.handleError('Wystąpił błąd podczas przesyłania zdjęcia');
          this.isLoading = false;
        }
      });
  }

  deleteImage() {
    this.isLoading = true;
    this.vehicleService.deleteImage(this.vehicleId)
      .subscribe({
        next: () => {
          this.imageUrl = '';
          this.isLoading = false;
        },
        error: () => {
          this.handleError('Wystąpił błąd podczas usuwania zdjęcia');
          this.isLoading = false;
        }
      });
  }

  handleError(message: string) {
    this.toastService.showError(message);
  }

  handleSuccessUpload() {
    this.toastService.showSuccess('Zdjęcie zostało przesłane');
  }

  getImageUrl() {
    return this.imageUrl || 'assets/no_image.png';
  }

  hasImage() {
    return this.imageUrl && this.imageUrl.trim() !== '' && !this.imageUrl.includes('no_image.png');
  }

}
