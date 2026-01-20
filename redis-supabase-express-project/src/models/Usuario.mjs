// Clase Usuario que representa un usuario del sistema
export class Usuario {
  // Constructor de la clase, recibe un objeto con las propiedades del usuario
  constructor({ id, nombre, email, password, created_at, updated_at }) {
    // Validaciones basicas

    // Nombre obligatorio
    if (!nombre || nombre.trim() === '') throw new Error('Nombre es obligatorio');

    // Email obligatorio y formato valido
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email invalido');

    // Password obligatorio y con minimo 6 caracteres
    if (!password || password.length < 6) throw new Error('Password debe tener al menos 6 caracteres');

    // Asignacion del id, si no se proporciona se asigna null
    if (id !== undefined && id !== null) {
      this.id = id;
    } else {
      this.id = null;
    }

    // Asignacion de nombre y email normalizados
    this.nombre = nombre.trim();
    this.email = email.trim().toLowerCase();

    // Asignacion de password
    this.password = password;

    // Asignacion de created_at, si no se proporciona se asigna la fecha actual
    if (created_at !== undefined && created_at !== null) {
      this.created_at = created_at;
    } else {
      this.created_at = new Date();
    }

    // Asignacion de updated_at, si no se proporciona se asigna la fecha actual
    if (updated_at !== undefined && updated_at !== null) {
      this.updated_at = updated_at;
    } else {
      this.updated_at = new Date();
    }
  }

  // Metodo que devuelve un objeto JSON con todas las propiedades del usuario
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

  // Metodo que devuelve la version publica del usuario, sin incluir password
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
