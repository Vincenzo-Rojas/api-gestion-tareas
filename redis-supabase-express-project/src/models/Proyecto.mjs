// Clase Proyecto que representa un proyecto en el sistema
export class Proyecto {
  // Constructor de la clase, recibe un objeto con las propiedades del proyecto
  constructor({ id, nombre, descripcion, created_at, updated_at }) {
    // Validacion: nombre obligatorio
    if (!nombre || nombre.trim() === '') throw new Error('Nombre del proyecto es obligatorio');

    // Validacion: descripcion no debe exceder 1000 caracteres
    if (descripcion && descripcion.length > 1000) throw new Error('Descripcion demasiado larga');

    // Asignacion del id, si no se proporciona se asigna null
    if (id !== undefined && id !== null) {
      this.id = id;
    } else {
      this.id = null;
    }

    // Asignacion del nombre, eliminando espacios al inicio y final
    this.nombre = nombre.trim();

    // Asignacion de descripcion, si no se proporciona se asigna cadena vacia
    if (descripcion !== undefined && descripcion !== null) {
      this.descripcion = descripcion;
    } else {
      this.descripcion = '';
    }

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

  // Metodo que devuelve un objeto JSON con todas las propiedades del proyecto
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  // Metodo que devuelve la version publica del proyecto, actualmente igual a toJSON
  toPublic() {
    return this.toJSON();
  }
}
