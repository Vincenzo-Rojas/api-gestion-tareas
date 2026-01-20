// Clase Tarea que representa una tarea asociada a un proyecto
export class Tarea {
  // Constructor de la clase, recibe un objeto con las propiedades de la tarea
  constructor({ id, titulo, descripcion, estado, proyecto_id, created_at, updated_at }) {
    // Validacion: el titulo es obligatorio
    if (!titulo || titulo.trim() === '') throw new Error('Titulo de la tarea es obligatorio');

    // Validacion: el estado debe estar dentro de los estados permitidos
    const estadosValidos = ['pendiente', 'en_progreso', 'finalizada', 'cancelada'];
    if (!estado || estadosValidos.indexOf(estado) === -1) throw new Error(
      'Estado invalido. Debe ser uno de: ' + estadosValidos.join(', ')
    );

    // Validacion: proyecto_id debe ser un numero valido
    if (!proyecto_id || typeof proyecto_id !== 'number') throw new Error('proyecto_id invalido');

    // Asignacion del id, si no se proporciona se asigna null
    if (id !== undefined && id !== null) {
      this.id = id;
    } else {
      this.id = null;
    }

    // Asignacion del titulo, eliminando espacios al inicio y final
    this.titulo = titulo.trim();

    // Asignacion de descripcion, si no se proporciona se asigna cadena vacia
    if (descripcion !== undefined && descripcion !== null) {
      this.descripcion = descripcion;
    } else {
      this.descripcion = '';
    }

    // Asignacion del estado y proyecto_id
    this.estado = estado;
    this.proyecto_id = proyecto_id;

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

  // Metodo que devuelve un objeto JSON con todas las propiedades de la tarea
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

  // Metodo que devuelve la version publica de la tarea, actualmente igual a toJSON
  toPublic() {
    return this.toJSON();
  }
}
