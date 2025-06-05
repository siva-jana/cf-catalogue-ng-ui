import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserAuthService } from '../user-auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component'; // Adjust path if needed
import { RecaptchaModule } from "ng-recaptcha";
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,RecaptchaModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  username: string = '';
  email: string = '';
  
  password: string = '';
  confirmPassword: string = '';
  isSubmitting: boolean = false;
  validationErrors: any = [];
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  department: string = '';
  departments: string[] = ['IT', 'TECH', 'ACCOUNTS', 'COMMUNICATION', 'HR', 'DNI'];
  captchaToken: string = '';

  constructor(
     public userAuthService: UserAuthService,
     private router: Router,
     private dialog: MatDialog,
     private meta: Meta,
     private title: Title,
) {}
  openLoginDialog(event: Event) {
  event.preventDefault();
  this.dialog.open(LoginComponent, {
    width: '400px', // adjust as needed
    disableClose: true
  });
}
  ngOnInit(): void {
    this.title.setTitle('Register | Data Catalouge');
    this.meta.updateTag({ name: 'description', content: 'Create a new account on Your Site Name.' },);
    this.meta.updateTag({ name: 'keywords', content: 'user registration, create account, sign up, user signup, registration form, captcha verification, secure registration, password validation, department selection, email verification, user authentication, register new user, data catalogue registration, angular registration form, recaptcha, secure signup, username validation' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('/dashboard');
    }
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
 onCaptchaResolved(token: string|null) {
  this.captchaToken = token ?? '';
}
  registerAction() {
    if (!this.username || this.username.trim() === '') {
      alert('Username is required');
      return;
    }
   
    if (this.username.length > 15) {
      alert('Username should not exceed 15 characters');
      return;
    }

    

    const emailRegex = /^[a-zA-Z0-9._%+-]+@janaagraha\.org$/;
    if (!emailRegex.test(this.email)) {
      alert('Please enter a valid Gmail address (e.g., john@janaagraha.org)');
      return;
    }
   if (!this.department) {
  alert('Please select a department');
  return;
   }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(this.password)) {
      alert('Password must be at least 8 characters and include uppercase, lowercase, and a symbol.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!this.captchaToken) {
    alert('Please complete the CAPTCHA.');
    return;
  }

    this.isSubmitting = true;

    const payload = {
      username: this.username,
      email: this.email,
      password: this.password,
      confirmPassword: this.confirmPassword,
      department: this.department ,
      recaptchaToken: this.captchaToken 
    };

    this.userAuthService.register(payload)
      .then(({ data }) => {
        localStorage.setItem('token', data.token);
        this.router.navigateByUrl('/dashboard');
        return data;
      }).catch(error => {
        this.isSubmitting = false;
        if (error.response?.data?.errors) {
          this.validationErrors = error.response.data.errors;
        }
        return error;
      });
  }
}