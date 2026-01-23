export class Usuario {
  constructor({ id, nombre, email, password, created_at, updated_at, api_key, role }) {
    if (!nombre || nombre.trim() === '') throw new Error('Nombre es obligatorio');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email invalido');
    if (!password || password.length < 6) throw new Error('Password debe tener al menos 6 caracteres');

    this.id = id ?? null;
    this.nombre = nombre.trim();
    this.email = email.trim().toLowerCase();
    this.password = password;
    this.created_at = created_at ?? new Date();
    this.updated_at = updated_at ?? new Date();
    
    this.api_key = api_key ?? null;
    this.role = role ?? 'user';
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      created_at: this.created_at,
      updated_at: this.updated_at,
      api_key: this.api_key,
      role: this.role
    };
  }

  toPublic() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at,
      api_key: this.api_key,
      role: this.role
    };
  }
}
