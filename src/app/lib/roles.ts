type Role = {
  code: string;
  name: string;
  description: string;
  is_global: boolean;
};

const roleCache = new Map<string, Role>();
let initialized = false;

async function fetchRoles(): Promise<void> {
  const res = await fetch('http://localhost:3000/roles');
  if (!res.ok) throw new Error('Failed to fetch roles');
  const roles: Role[] = await res.json();

  for (const role of roles) {
    roleCache.set(role.code, role);
  }

  initialized = true;
}

export async function initializeRoleCache() {
  if (!initialized) await fetchRoles();
}

export function getRoleByCode(code: string): Role | undefined {
  return roleCache.get(code);
}

export function getAllRoles(): Role[] {
  return Array.from(roleCache.values());
}
