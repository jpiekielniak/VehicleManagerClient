import {Component, Input} from '@angular/core';
import {NgForOf} from "@angular/common";
import {VehicleDetails} from "../../types/vehicle-details.type";

@Component({
  selector: 'app-vehicle-info-grid',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './vehicle-info-grid.component.html',
  styleUrl: './vehicle-info-grid.component.css'
})
export class VehicleInfoGridComponent {
  @Input() vehicle!: VehicleDetails;

  get fields() {
    return [
      { label: 'Marka', value: this.vehicle.brand },
      { label: 'Model', value: this.vehicle.model },
      { label: 'Rok produkcji', value: this.vehicle.year },
      { label: 'Rejestracja', value: this.vehicle.licensePlate },
      { label: 'Numer VIN', value: this.vehicle.vin },
      { label: 'Poj. silnika', value: `${this.vehicle.engineCapacity} cm3` },
      { label: 'Moc silnika', value: `${this.vehicle.enginePower} KM` },
      { label: 'Skrzynia biegów', value: this.vehicle.gearboxType },
      { label: 'Rodzaj paliwa', value: this.vehicle.fuelType },
      { label: 'Typ pojazdu', value: this.vehicle.vehicleType }
  ];
  }
}
