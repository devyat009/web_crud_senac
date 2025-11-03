import { Injectable, NgZone } from '@angular/core';

declare global {
  interface Window {
    google?: { accounts?: { id?: unknown } };
  }
}

declare const google: any;

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private scriptLoadingPromise: Promise<void> | null = null;
  private initialized = false;

  constructor(private readonly ngZone: NgZone) {}

  async initialize(clientId: string, credentialCallback: (credential: string) => void): Promise<void> {
    if (!clientId) {
      throw new Error('Client ID do Google não configurado.');
    }

    await this.ensureScriptLoaded();

    if (this.initialized) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response: { credential: string }) => {
          if (response?.credential) {
            this.ngZone.run(() => credentialCallback(response.credential));
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
    });

    this.initialized = true;
  }

  renderButton(target: HTMLElement, options?: Record<string, unknown>): void {
    if (!target || !this.initialized) {
      return;
    }

    target.innerHTML = '';
    // width must be a number (px). Use container width clamped between 120 and 400.
    const computedWidth = Math.min(Math.max(target.clientWidth || 320, 120), 400);
    const buttonOptions = {
      type: 'standard',
      theme: 'filled_blue',
      size: 'large',
      text: 'signin_with',
      shape: 'rectangular',
      width: computedWidth,
      ...options,
    };

    this.ngZone.runOutsideAngular(() => {
      google.accounts.id.renderButton(target, buttonOptions);
    });
  }

  prompt(): void {
    if (!this.initialized) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      google.accounts.id.prompt();
    });
  }

  private ensureScriptLoaded(): Promise<void> {
    if (typeof window === 'undefined') {
      return Promise.reject(new Error('Google SSO não está disponível no ambiente atual.'));
    }

    if (window.google?.accounts?.id) {
      return Promise.resolve();
    }

    if (this.scriptLoadingPromise) {
      return this.scriptLoadingPromise;
    }

    this.scriptLoadingPromise = new Promise<void>((resolve, reject) => {
      const scriptId = 'google-identity-services';
      const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(), { once: true });
        existingScript.addEventListener('error', () => reject(new Error('Falha ao carregar o SDK do Google.')), { once: true });
        return;
      }

      const scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.src = 'https://accounts.google.com/gsi/client';
      scriptElement.async = true;
      scriptElement.defer = true;
      scriptElement.onload = () => resolve();
      scriptElement.onerror = () => reject(new Error('Falha ao carregar o SDK do Google.'));

      document.head.appendChild(scriptElement);
    });

    return this.scriptLoadingPromise;
  }
}
