export class ApiKey {
  constructor({ id, usuario_id, api_key, role, is_active, created_at, updated_at }) {
    if (!usuario_id) throw new Error('usuario_id es obligatorio para la API Key');
    if (!api_key) throw new Error('api_key es obligatoria');

    this.id = id ?? null;
    this.usuario_id = usuario_id;
    this.api_key = api_key;
    this.role = ['user', 'admin'].includes(role) ? role : 'user';
    this.is_active = is_active ?? true;
    this.created_at = created_at ? new Date(created_at) : new Date();
    this.updated_at = updated_at ? new Date(updated_at) : new Date();
  }

  toJSON() {
    return {
      id: this.id,
      usuario_id: this.usuario_id,
      api_key: this.api_key,
      role: this.role,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  toPublic() {
    return {
      usuario_id: this.usuario_id,
      role: this.role,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  isAdmin() {
    return this.role === 'admin';
  }
}