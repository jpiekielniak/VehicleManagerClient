// vehicle-image.component.ts
import { Component, Input } from '@angular/core';
import { FileUploadModule } from "primeng/fileupload";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {API_CONSTANTS} from "../../../../../constants/api.constants";

interface UploadResponse {
  imageUrl?: string;
}

@Component({
  selector: 'app-vehicle-image',
  standalone: true,
  imports: [
    FileUploadModule
  ],
  templateUrl: './vehicle-image.component.html',
  styleUrl: './vehicle-image.component.css'
})
export class VehicleImageComponent {
  @Input() imageUrl!: string;
  @Input() vehicleId!: string;

  constructor(private http: HttpClient) {}

  get validImageUrl(): string {
    return this.imageUrl && this.imageUrl.trim()
      ? this.imageUrl
      : '/assets/no_image.png';
  }

  get uploadButtonLabel(): string {
    return this.imageUrl && this.imageUrl.trim()
      ? 'Zmień zdjęcie'
      : 'Dodaj zdjęcie';
  }

  onBasicUploadAuto(event: any) {
    const file = event.files[0];
    if (file) {
      const formData = new FormData();
      // Zmieniono nazwę pola na 'file' zgodnie z przykładem curl
      formData.append('file', file, file.name);

      this.uploadImage(formData, this.vehicleId).subscribe({
        next: (response: UploadResponse) => {
          console.log('Image uploaded successfully', response);
          if (response.imageUrl) {
            this.imageUrl = response.imageUrl;
          }
        },
        error: (error) => {
          console.error('Error uploading image', error);
          // Możesz tutaj dodać obsługę błędów, np. wyświetlenie komunikatu
        }
      });
    }
  }

  uploadImage(image: FormData, vehicleId: string) {
    const headers = new HttpHeaders({
      'Accept': 'application/json'
      // Content-Type zostanie automatycznie ustawiony przez HttpClient
    });

    return this.http.post<UploadResponse>(
      `${API_CONSTANTS.VEHICLE.BASE_PATH}/${vehicleId}/image`,
      image,
      { headers }
    );
  }

  protected readonly API_CONSTANTS = API_CONSTANTS;
}
