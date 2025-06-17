import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import Aura  from '@primeng/themes/aura';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { ApplicationConfig } from '@angular/core';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura
            }
        })
    ]
};

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
