<template>
    <ListarPermisoComponent />
</template>
<script>
import ListarPermisoComponent from '../components/permiso/ListarPermisoComponent.vue';
export default {
    name: 'pageRoles',
    layout: 'default',
    middleware: 'auth',
    components: {
        ListarPermisoComponent
    },

}
</script>