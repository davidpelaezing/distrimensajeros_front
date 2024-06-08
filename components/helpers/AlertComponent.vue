<template>
    <v-dialog v-model="dialog" persistent max-width="320">
        <v-card elevation="0" class="rounded-xxl overflow-hidden">
            <v-card-title>¿Estás seguro de continuar?</v-card-title>
            <v-card-text>{{ mensaje }}</v-card-text>
            <v-card-actions>
                <div class="ml-auto">
                    <v-btn @click="cancelar" text color="error">cancelar</v-btn>
                    <v-btn @click="confirmar" text color="secondary">cofirmar</v-btn>
                </div>
            </v-card-actions>
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
<style>
.v-dialog.v-dialog--active.v-dialog--persistent {
    border-radius: 24px;
}
</style>