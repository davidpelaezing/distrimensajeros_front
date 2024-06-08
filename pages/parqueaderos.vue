<template>
    <ListarParqueaderoComponent />
</template>
<script>
import ListarParqueaderoComponent from '@/components/parqueadero/ListarParqueaderoComponent.vue';
export default {
    layout: 'default',
    middleware: 'auth',
    meta: {
        roles: ['administrador', 'supervisor']
    },
    components: {
        ListarParqueaderoComponent
    },
}
</script>