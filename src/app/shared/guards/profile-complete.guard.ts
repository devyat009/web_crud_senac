import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';

function isProfileIncomplete(u: any): boolean {
  if (!u) return true;
  const telefoneOk = typeof u.telefone === 'string' && /^\d{10,11}$/.test(u.telefone);
  const nascimentoOk = !!u.data_nascimento;
  const cpfOk = !u.cpf || (typeof u.cpf === 'string' && /^\d{11}$/.test(u.cpf));
  return !(telefoneOk && nascimentoOk && cpfOk);
}

export const profileCompleteGuard: CanActivateFn = async (_route, state) => {
  const router = inject(Router);
  const storage = inject(StorageService);
  const userService = inject(UserService);

  // Allow access to login and perfil explicitly
  if (state.url.startsWith('/login') || state.url.startsWith('/perfil')) {
    return true;
  }

  const cached = storage.getItem('loggedInUser');
  if (!cached) {
    return router.parseUrl('/login');
  }

  let current: any;
  try {
    current = JSON.parse(cached);
  } catch {
    return router.parseUrl('/login');
  }

  const id = current?.user_id;
  if (!id) {
    return router.parseUrl('/login');
  }

  try {
    const user = await userService.getUserById(id);
    if (isProfileIncomplete(user)) {
      return router.parseUrl('/perfil');
    }
    return true;
  } catch {
    // If cannot fetch user, be safe and force profile page
    return router.parseUrl('/perfil');
  }
};
