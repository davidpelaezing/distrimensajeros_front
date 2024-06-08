<template>
    <ListarRolComponent />
</template>
<script>
import ListarRolComponent from '../components/rol/ListarRolComponent.vue';
export default {
    name: 'pageRoles',
    layout: 'default',
    middleware: 'auth',
    components: {
        ListarRolComponent
    },

}
</script>