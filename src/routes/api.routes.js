const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const AUTH_ROUTES = {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    FORGOT_PASSWORD: `${API_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_URL}/auth/reset-password`,
};

export const PROFILE_ROUTES = {
    GET_PROFILE: `${API_URL}/perfil`,
    UPDATE_PROFILE: `${API_URL}/perfil`,
};

export const ROLES_ROUTES = {
    GET_ROLES: `${API_URL}/rol`,
};

export const ADMIN_ROUTES = {
    CREATE_USER: `${API_URL}/perfil/admin/crear`,
    GET_ALL_USERS: `${API_URL}/perfil/admin/usuarios`,
    UPDATE_USER: (nickname) => `${API_URL}/perfil/admin/actualizar/${nickname}`,
    DELETE_USER: (nickname) => `${API_URL}/perfil/admin/eliminar/${nickname}`,
    UPDATE_ROLE: `${API_URL}/perfil/admin/rol`,
};

export const GAMES_ROUTES = {
    GET_ALL: `${API_URL}/juegos`,
    GET_ONE: (id) => `${API_URL}/juegos/${id}`,
    CREATE: `${API_URL}/juegos`,
    UPDATE: (id) => `${API_URL}/juegos/${id}`,
    DELETE: (id) => `${API_URL}/juegos/${id}`,
    GET_INICIO: `${API_URL}/juegos/inicio`,
    TOGGLE_VISIBILITY: (id) => `${API_URL}/juegos/${id}/visibilidad`
};

export const CATEGORY_ROUTES = {
    GET_ALL: `${API_URL}/categoria`,
    GET_ONE: (id) => `${API_URL}/categoria/${id}`,
    CREATE: `${API_URL}/categoria`,
    UPDATE: (id) => `${API_URL}/categoria/${id}`,
    DELETE: (id) => `${API_URL}/categoria/${id}`,
};

export const LOGROS_ROUTES = {
    GET_ALL: `${API_URL}/logros`,
    GET_DESTACADOS: `${API_URL}/logros/destacados`,
    GET_BY_ID: (idLogros) => `${API_URL}/logros/${idLogros}`,
    CREATE: `${API_URL}/logros`,
    UPDATE: (idLogros) => `${API_URL}/logros/${idLogros}`,
    DELETE: (idLogros) => `${API_URL}/logros/${idLogros}`
};

export const COMODINES_ROUTES = {
    GET_ALL: `${API_URL}/comodines`,
    GET_ALL_PUBLIC: `${API_URL}/comodines/todos`,
    GET_BY_ID: (idComodines) => `${API_URL}/comodines/${idComodines}`,
    CREATE: `${API_URL}/comodines`,
    UPDATE: (idComodines) => `${API_URL}/comodines/${idComodines}`,
    DELETE: (idComodines) => `${API_URL}/comodines/${idComodines}`
};

export const EDICION_ROUTES = {
    GET_ALL: `${API_URL}/edicion`,
    GET_BY_ID: (idEdicion) => `${API_URL}/edicion/${idEdicion}`,
    CREATE: `${API_URL}/edicion`,
    UPDATE: (idEdicion) => `${API_URL}/edicion/${idEdicion}`,
    DELETE: (idEdicion) => `${API_URL}/edicion/${idEdicion}`,
    ASIGNAR_JUEGOS: (idEdicion) => `${API_URL}/edicion/${idEdicion}/juegos`,
    ASIGNAR_JUGADORES: (idEdicion) => `${API_URL}/edicion/${idEdicion}/jugadores`,
    GET_JUEGOS_BY_EDICION: (idEdicion) => `${API_URL}/edicion/${idEdicion}/juegos`,
    GET_JUGADORES_BY_EDICION: (idEdicion) => `${API_URL}/edicion/${idEdicion}/jugadores`
};

export const PUNTOS_ROUTES = {
    GET_ALL: `${API_URL}/puntos`,
    GET_BY_TIPO: (tipo) => `${API_URL}/puntos/${tipo}`,
    CREATE_OR_UPDATE: `${API_URL}/puntos`,
    DELETE: (id) => `${API_URL}/puntos/${id}`
};

export const PARTIDAS_ROUTES = {
    GET_EDICIONES_ACTIVAS: `${API_URL}/partidas/ediciones-activas`,
    GET_JUGADORES_BY_EDICION: (idEdicion) => `${API_URL}/partidas/jugadores/${idEdicion}`,
    GET_PERFIL_JUGADOR: (nickname) => `${API_URL}/partidas/perfil/${nickname}`,
    GET_TABLA_GENERAL: `${API_URL}/partidas/tabla-general`,
    GET_ESTADISTICAS_REALES: `${API_URL}/partidas/estadisticas-reales`,
    GET_ALL: `${API_URL}/partidas`,
    GET_BY_ID: (id) => `${API_URL}/partidas/${id}`,
    CREATE: `${API_URL}/partidas`,
    UPDATE: (id) => `${API_URL}/partidas/${id}`,
    DELETE: (id) => `${API_URL}/partidas/${id}`,
    REGISTRAR_RESULTADO: (id) => `${API_URL}/partidas/${id}/resultado`,
    GET_RESULTADO: (id) => `${API_URL}/partidas/${id}/resultado`,
    LIMPIAR_TABLA_GENERAL: `${API_URL}/partidas/limpiar-tabla-general`
};

export const ENTRADAS_ROUTES = {
    GET_ALL: `${API_URL}/entradas`,
    GET_ONE: (id) => `${API_URL}/entradas/${id}`,
    CREATE: `${API_URL}/entradas`,
    UPDATE: (id) => `${API_URL}/entradas/${id}`,
    DELETE: (id) => `${API_URL}/entradas/${id}`
};

export const CONFIGURACION_ROUTES = {
    GET_INICIO: `${API_URL}/configuracion/inicio`,
    UPDATE_INICIO: `${API_URL}/configuracion/inicio`
};

export const TORNEO_ROUTES = {
    GET_JUGADORES: `${API_URL}/torneo/jugadores`,
    GET_JUGADORES_INICIO: `${API_URL}/torneo/jugadores-inicio`,
    SET_JUGADORES_INICIO: `${API_URL}/torneo/jugadores-inicio`
};

export const RULETA_ROUTES = {
    GET_ALL: `${API_URL}/ruleta`,
    GET_ONE: (id) => `${API_URL}/ruleta/${id}`,
    CREATE: `${API_URL}/ruleta`,
    UPDATE: (id) => `${API_URL}/ruleta/${id}`,
    DELETE: (id) => `${API_URL}/ruleta/${id}`,
    GET_CONFIGURACION: `${API_URL}/ruleta/configuracion`,
    UPDATE_CONFIGURACION: `${API_URL}/ruleta/configuracion`,
    GET_ESTADO: `${API_URL}/ruleta/estado`,
    GIRAR: `${API_URL}/ruleta/girar`,
    GET_HISTORIAL: `${API_URL}/ruleta/historial`,
    GET_ESTADISTICAS: `${API_URL}/ruleta/estadisticas`
};

export const USUARIOS_ROUTES = {
    GET_LOGROS: `${API_URL}/usuarios/logros`,
    POST_LOGROS: `${API_URL}/usuarios/logros`,
    DELETE_LOGROS: (id) => `${API_URL}/usuarios/logros/${id}`,
    GET_COMODINES: `${API_URL}/usuarios/comodines`,
    DELETE_COMODINES: (id) => `${API_URL}/usuarios/comodines/${id}`,
    GET_LOGROS_COMODINES: (nickname) => `${API_URL}/usuarios/${nickname}/logros-comodines`
};

// Rutas del histórico
export const HISTORICO_ROUTES = {
  GET_EDICIONES: `${API_URL}/historico/ediciones`,
  GET_TABLA_GENERAL: (idEdicion) => `${API_URL}/historico/tabla-general/${idEdicion}`,
}; 