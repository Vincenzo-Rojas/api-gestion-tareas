export class Usuario {
  constructor({ id, nombre, email, password, created_at, updated_at }) {
    // Validaciones básicas
    if (!nombre || nombre.trim() === '') throw new Error('Nombre es obligatorio');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email inválido');
    if (!password || password.length < 6) throw new Error('Password debe tener al menos 6 caracteres');

    // Asignación de propiedades
    if (id !== undefined && id !== null) {
      this.id = id;
    } else {
      this.id = null;
    }

    this.nombre = nombre.trim();
    this.email = email.trim().toLowerCase();
    this.password = password;

    if (created_at !== undefined && created_at !== null) {
      this.created_at = created_at;
    } else {
      this.created_at = new Date();
    }

    if (updated_at !== undefined && updated_at !== null) {
      this.updated_at = updated_at;
    } else {
      this.updated_at = new Date();
    }
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  toPublic() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}
