export default function ({ $axios, store }) {
    // Interceptor para agregar el token a todas las solicitudes salientes
    $axios.onRequest(config => {
        
        const token = store.getters['auth/tokenAuthenticated'];
        if (token) {
            const tokenPreparado = `Bearer ${token}`
            config.headers.common['Authorization'] = tokenPreparado;
        }
        return config;
    });
}