<template>
    <ListarFacturaComponent />
</template>
<script>
import ListarFacturaComponent from '@/components/factura/ListarFacturaComponent.vue';
export default {
    layout: 'default',
    middleware: 'auth',
    components: {
        ListarFacturaComponent
    },

}
</script>