import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import axios from 'axios';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(@Inject(PLATFORM_ID) private platformId: any) { }

  login(data: any): Promise<any> {
    let payload = {
      username: data.username,
      password: data.password
    }

    // Changed the login URL to match the given API endpoint
    return axios.post('http://localhost:8080/api/auth/signin', payload).then(res=>{
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
    }
     return res;
  });
}

  register(data: any): Promise<any> {
    let payload = {
      username: data.username,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      department: data.department,
      recaptchaToken: data.recaptchaToken
    }

    // Changed the register URL to match the given API endpoint
    return axios.post('http://localhost:8080/api/auth/signup', payload)
    
  }

  getUser(): Promise<any> {
    if (isPlatformBrowser(this.platformId)) {
      // Only access localStorage in the browser
      const token = localStorage.getItem('token');
      console.log(token)
      if (!token) {
        return Promise.reject('Token not found in localStorage');
      }
  
      return axios.get('http://localhost:8080/api/user', {
        headers: { Authorization: 'Bearer ' + token } // Ensure the token is sent correctly
      });
    } else {
      // Handle case where localStorage is not available (for SSR)
      return Promise.reject('localStorage is not available on the server side');
    }
  }

  logout(): Promise<any> {
    if (isPlatformBrowser(this.platformId)) {
      // Only access localStorage in the browser
      return axios.post('http://localhost:8080/api/auth/signout', {}, { headers: { Authorization: 'Bearer ' + localStorage.getItem('token') } });
    } else {
      // Handle case where localStorage is not available (for SSR)
      return Promise.reject('localStorage is not available on the server side');
    }
  }
}
