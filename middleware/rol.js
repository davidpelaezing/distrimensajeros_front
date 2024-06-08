export default function ({ store, redirect, route }) {

    const roles = route.meta[0] ? route.meta[0].roles : [];
    // si la ruta no requieres roles directamente dejamos avanzar
    if (!roles || roles.length === 0) {
        return ;
    }
    // si la ruta requiere roles
    if (roles.includes(store.getters['auth/getRol'])) {
        console.log('entro')
        return 
    }
    return redirect('/')
}