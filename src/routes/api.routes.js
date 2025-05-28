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
    DELETE: (id) => `${API_URL}/juegos/${id}`
};

export const CATEGORY_ROUTES = {
    GET_ALL: `${API_URL}/categoria`,
    GET_ONE: (id) => `${API_URL}/categoria/${id}`,
    CREATE: `${API_URL}/categoria`,
    UPDATE: (id) => `${API_URL}/categoria/${id}`,
    DELETE: (id) => `${API_URL}/categoria/${id}`,
}; 