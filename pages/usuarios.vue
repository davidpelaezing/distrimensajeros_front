<template>
    <ListarUsuarioComponent />
</template>
<script>
import ListarUsuarioComponent from '../components/usuario/ListarUsuarioComponent.vue';
export default {
    layout: 'default',
    middleware: ['auth'],
    meta: {
        roles: ['administrador']
    },
    components: {
        ListarUsuarioComponent
    },

}
</script>
