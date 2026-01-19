export class Proyecto {
  constructor({ id, nombre, descripcion, created_at, updated_at }) {
    if (!nombre || nombre.trim() === '') throw new Error('Nombre del proyecto es obligatorio');
    if (descripcion && descripcion.length > 1000) throw new Error('Descripción demasiado larga');

    if (id !== undefined && id !== null) {
      this.id = id;
    } else {
      this.id = null;
    }

    this.nombre = nombre.trim();

    if (descripcion !== undefined && descripcion !== null) {
      this.descripcion = descripcion;
    } else {
      this.descripcion = '';
    }

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
      descripcion: this.descripcion,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  toPublic() {
    return this.toJSON();
  }
}
