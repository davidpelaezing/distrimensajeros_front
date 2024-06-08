export const state = () => ({
    usuarios: [],
});

export const mutations = {
    SET_USUARIOS(state, usuarios) {
        state.usuarios = usuarios;
    },
};

export const actions = {
    getUsuarios({ commit }) {
        // Aquí podrías hacer una llamada a tu API para obtener la lista de usuarios
        const usuarios = [ /* Lista de usuarios obtenida de la API */];
        commit('SET_USUARIOS', usuarios);
    },
};

export const getters = {
    getUsers(state) {
        return state.usuarios;
    },
};