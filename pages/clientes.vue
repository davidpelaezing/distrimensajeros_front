<template>
    <ListarClienteComponent />
</template>
<script>
import ListarClienteComponent from '@/components/cliente/ListarClienteComponent.vue';
export default {
    layout: 'default',
    middleware: 'auth',
    meta: {
        roles: ['administrador', 'supervisor', 'operario']
    },
    components: {
        ListarClienteComponent
    },

}
</script>