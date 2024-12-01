import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from "../auth/shared/services/auth.service";
import {DatePipe, NgIf} from "@angular/common";
import {FormsModule, NgForm} from "@angular/forms";
import {UserCompleteData} from "../../shared/types/user-complete-data.type";

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    NgIf
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css'
})
export class UserDetailsComponent implements OnInit {
  private readonly authService = inject(AuthService);

  userDetails: any;
  isDataLoading = false;
  isEditing = false;
  editedUser: UserCompleteData = {
    id: '',
    firstName: null,
    lastName: null,
    phoneNumber: null
  };

  ngOnInit() {
    this.loadUserDetails();

  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing && this.userDetails) {
      this.editedUser = {
        id: this.userDetails.id,
        firstName: this.userDetails.firstName || null,
        lastName: this.userDetails.lastName || null,
        phoneNumber: this.userDetails.phoneNumber || null
      };
    }
  }

  onSubmit() {
    const updatedData: UserCompleteData = {
      id: this.userDetails?.id || '',
      firstName: this.editedUser.firstName?.trim() || null,
      lastName: this.editedUser.lastName?.trim() || null,
      phoneNumber: this.editedUser.phoneNumber?.trim() || null
    };

    this.isEditing = false;

    this.authService.completeUserData(updatedData).subscribe({
      next: () => {
        this.loadUserDetails();
      },
      error: (err) => {
        console.error('Failed to update user details', err);
      }
    })
  }

  cancelEdit() {
    this.isEditing = false;
  }

  loadUserDetails() {
    this.isDataLoading = true;

    this.authService.getUserDetails().subscribe({
      next: (response: any) => {
        this.userDetails = response;
        this.isDataLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch user details', err);
        this.isDataLoading = false;
      }
    })
  }

}
