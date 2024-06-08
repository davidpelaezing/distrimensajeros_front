<template>
    <v-card elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <h1>En proceso ...</h1>
    </v-card>
</template>
<script>
import ListarUsuarioComponent from '@/components/usuario/ListarUsuarioComponent.vue';
export default {
    layout: 'default',
    middleware: 'auth',
    meta: {
        roles: ['administrador', 'supervisor', 'operario']
    },
    components: {
        ListarUsuarioComponent
    },

}
</script>