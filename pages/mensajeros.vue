<template>
    <ListarMensajeroComponent />
</template>
<script>
import ListarMensajeroComponent from '@/components/mensajero/ListarMensajeroComponent.vue';
export default {
    layout: 'default',
    middleware: 'auth',
    meta: {
        roles: ['administrador', 'supervisor', 'operario']
    },
    components: {
        ListarMensajeroComponent
    },

}
</script>