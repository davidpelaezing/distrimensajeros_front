<template>
    <ReporteComponent />
</template>
<script>
import ReporteComponent from '../components/reportes/ReporteComponent.vue';
export default {
    layout: 'default',
    middleware: ['auth'],
    meta: {
        roles: ['administrador']
    },
    components: {
        ReporteComponent
    },

}
</script>
