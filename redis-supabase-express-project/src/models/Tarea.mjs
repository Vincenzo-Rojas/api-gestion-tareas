export class Tarea {
  constructor({ id, titulo, descripcion, estado, proyecto_id, created_at, updated_at }) {
    if (!titulo || titulo.trim() === '') throw new Error('Título de la tarea es obligatorio');

    const estadosValidos = ['pendiente', 'en_progreso', 'finalizada', 'cancelada'];
    if (!estado || estadosValidos.indexOf(estado) === -1) throw new Error(
      'Estado inválido. Debe ser uno de: ' + estadosValidos.join(', ')
    );

    if (!proyecto_id || typeof proyecto_id !== 'number') throw new Error('proyecto_id inválido');

    if (id !== undefined && id !== null) {
      this.id = id;
    } else {
      this.id = null;
    }

    this.titulo = titulo.trim();

    if (descripcion !== undefined && descripcion !== null) {
      this.descripcion = descripcion;
    } else {
      this.descripcion = '';
    }

    this.estado = estado;
    this.proyecto_id = proyecto_id;

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
      titulo: this.titulo,
      descripcion: this.descripcion,
      estado: this.estado,
      proyecto_id: this.proyecto_id,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  toPublic() {
    return this.toJSON();
  }
}
