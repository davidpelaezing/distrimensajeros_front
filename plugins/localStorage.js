export default async ({ store }) => {
    const userData = localStorage.getItem('authUser');
    const tokenData = localStorage.getItem('authToken');

    if (userData && tokenData) {
        // Parsea la información del usuario guardada en localStorage
        const parsedUserData = JSON.parse(userData);

        // Llama a la acción de Vuex para guardar la información del usuario
        store.commit('auth/SET_AUTH_USER', parsedUserData);
        store.commit('auth/SET_AUTH_TOKEN', tokenData);
    }
};