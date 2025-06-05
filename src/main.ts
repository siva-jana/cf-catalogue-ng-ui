import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RecaptchaModule } from 'ng-recaptcha';

import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import axios from 'axios';
import { environment } from './environments/environment.development';

// Clear any stored token
localStorage.removeItem('token');

// Set default Axios configuration
axios.defaults.baseURL = environment.apiUrl;

axios.interceptors.request.use(function (config) {
  config.headers['X-Binarybox-Api-Key'] = environment.apiKey;
  return config;
});

// Bootstrap the Angular app with additional providers
bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    importProvidersFrom(RecaptchaModule)
  ]
}).catch((err) => console.error(err));
