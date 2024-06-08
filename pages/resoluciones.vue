<template>
    <ListarResolucionComponent />
</template>
<script>
import ListarResolucionComponent from '@/components/resolucion/ListarResolucionComponent.vue';
export default {
    layout: 'default',
    middleware: 'auth',
    meta: {
        roles: ['administrador', 'supervisor']
    },
    components: {
        ListarResolucionComponent
    },
}
</script>