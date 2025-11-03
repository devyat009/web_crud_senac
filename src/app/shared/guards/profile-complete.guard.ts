import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';

function isProfileIncomplete(u: any): boolean {
  if (!u) return true;
  const tel = (u.telefone ?? '').toString();
  const telefoneOk = /^\d{10,11}$/.test(tel) && tel !== '00000000000';

  const nasc = (u.data_nascimento ?? '').toString().slice(0, 10);
  const nascimentoOk = !!nasc && nasc !== '1970-01-01';

  // CPF continua opcional; se existir, valide 11 dígitos
  const cpf = u.cpf ?? '';
  const cpfOk = !cpf || /^\d{11}$/.test(cpf);

  // Também exigir nome mínimo
  const nomeOk = typeof u.nome === 'string' && u.nome.trim().length >= 3;

  return !(telefoneOk && nascimentoOk && cpfOk && nomeOk);
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
