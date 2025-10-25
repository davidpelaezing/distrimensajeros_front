<template>
    <ListarFormaPagoComponent />
</template>
<script>
import ListarFormaPagoComponent from '@/components/formaPago/ListarFormaPagoComponent.vue';
export default {
    layout: 'default',
    middleware: 'auth',
    meta: {
        roles: ['administrador', 'supervisor']
    },
    components: {
        ListarFormaPagoComponent
    },

}
</script>