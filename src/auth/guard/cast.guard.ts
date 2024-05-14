import { Ability } from '@casl/ability';

export function defineAbilitiesFor(role: string, { can }): void {
  if (role === 'admin') {
    can('manage', 'all');
  } else if (role === 'user') {
    can('read', 'my-transactions');
  }
}
