export const state = () => ({
    authToken: null,
    authUser: null,
});

export const mutations = {
    SET_AUTH_TOKEN(state, token) {
        state.authToken = token
    },
    SET_AUTH_USER(state, user) {
        state.authUser = user
    },
};

export const actions = {

    async login({ commit }, form) {
        return this.$axios.post("/auth/login", form).then(({ data }) => {
            // Guarda el token en Vuex y en el localStorage
            commit('SET_AUTH_TOKEN', data.token);
            localStorage.setItem('authToken', data.token);

            commit('SET_AUTH_USER', data.usuario);
            localStorage.setItem('authUser', JSON.stringify(data.usuario));
        });
    },

    logout({ commit }) {
        return this.$axios.post("/auth/logout", form).then(({ data }) => {
            // Limpia el token en Vuex y en el localStorage al cerrar sesión
            commit('SET_AUTH_TOKEN', null);
            localStorage.removeItem('authToken');

            commit('SET_AUTH_USER', null);
            localStorage.removeItem('authUser');
        });
    },
};

export const getters = {
    isAuthenticated: (state) => !!state.authToken,
    userAuthenticated: (state) => state.authUser,
    tokenAuthenticated: (state) => state.authToken,
    getRol: (state) => state.authUser.rol,
};
