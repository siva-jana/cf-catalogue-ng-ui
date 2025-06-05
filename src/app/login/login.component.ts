import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserAuthService } from '../user-auth.service';
import { Router,RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isSubmitting: boolean = false;
  validationErrors: string[] = [];

  constructor(
    public userAuthService: UserAuthService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private router: Router,
    private meta: Meta,
    private title: Title,

) {}

 
  closeDialog(): void {
    this.dialogRef.close();
  }
  goToRegister() {
  this.dialogRef.close(); // Closes the login dialog
  // Navigate to the register page after closing
  setTimeout(() => {
    this.router.navigate(['/register']);  // navigate to use Angular Router 
  }, 0);
}

  loginAction() {
    this.isSubmitting = true;
    const payload = {
      username: this.username,
      password: this.password,
    };

    this.userAuthService.login(payload).then(({ data }) => {
      localStorage.setItem('token', data.token);
        // Navigate first, then close the dialog
    this.router.navigateByUrl('/dashboard').then(() => {
      this.dialogRef.close(true);
    }); // Login successful
    }).catch(error => {
      this.isSubmitting = false;
      if (error.response?.data?.message) {
        this.validationErrors = [error.response.data.message];
      } else if (error.response?.data?.error) {
        this.validationErrors = [error.response.data.error];
      } else {
        this.validationErrors = ['Login failed. Please try again.'];
      }
    });
  }


}
