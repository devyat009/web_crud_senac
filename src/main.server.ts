import { provideServerRendering } from '@angular/platform-server';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

export function bootstrap() {
  return {
    app: AppComponent,
    providers: [
      ...(config.providers || []),
      provideServerRendering(),
    ],
  };
}

export default bootstrap;
