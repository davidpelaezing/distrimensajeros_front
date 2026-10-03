<template>
    <v-dialog v-model="dialog" persistent max-width="360" content-class="rounded-xl">
        <v-card flat class="rounded-xl overflow-hidden text-center pa-6">
            <v-avatar size="56" color="orange lighten-5" class="mb-4">
                <v-icon color="orange darken-2" size="30">mdi-alert-outline</v-icon>
            </v-avatar>
            <div class="text-h6 font-weight-bold mb-2">¿Estás seguro de continuar?</div>
            <div class="text-body-2 grey--text text--darken-1 mb-6">{{ mensaje }}</div>
            <div class="d-flex">
                <v-btn @click="cancelar" outlined color="grey darken-1" class="rounded-lg flex-grow-1 mr-2">Cancelar</v-btn>
                <v-btn @click="confirmar" depressed color="primary" class="rounded-lg flex-grow-1">Confirmar</v-btn>
            </div>
        </v-card>
    </v-dialog>
</template>
  
<script>
export default {
    data() {
        return {
            dialog: false,
            mensaje: '',
        };
    },

    methods: {
        async show(mensaje) {
            this.mensaje = mensaje;
            this.dialog = true;
            return new Promise(resolve => {
                this.resolve = resolve;
            });
        },
        confirmar() {
            this.dialog = false;
            this.resolve(true);
        },
        cancelar() {
            this.dialog = false;
            this.resolve(false);
        }
    }
};
</script>
