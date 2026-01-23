/**
 * Modelo de datos para API Key
 * Representa la estructura de la tabla api_keys en la base de datos
 */
export class ApiKey {
  constructor({ id, usuario_id, api_key, role, is_active, created_at, updated_at }) {
    // Asignación del id
    this.id = id !== undefined && id !== null ? id : null;

    // Relación con usuario
    if (usuario_id === undefined || usuario_id === null) {
      throw new Error('usuario_id es obligatorio para la API Key');
    }
    this.usuario_id = usuario_id;

    // API Key obligatoria
    if (!api_key) throw new Error('api_key es obligatoria');
    this.api_key = api_key;

    // Role con valor por defecto 'user' y validación
    this.role = ['user', 'admin'].includes(role) ? role : 'user';

    // Estado activo por defecto true
    this.is_active = is_active !== undefined ? is_active : true;

    // Fechas
    this.created_at = created_at ? new Date(created_at) : new Date();
    this.updated_at = updated_at ? new Date(updated_at) : new Date();
  }

  /**
   * Convierte el modelo a un objeto plano para la respuesta
   */
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

  /**
   * Convierte el modelo a un objeto seguro (sin exponer api_key)
   */
  toPublic() {
    return {
      usuario_id: this.usuario_id,
      role: this.role,
      is_active: this.is_active,
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }

  /**
   * Verifica si la API Key corresponde a un administrador
   */
  isAdmin() {
    return this.role === 'admin';
  }
}
