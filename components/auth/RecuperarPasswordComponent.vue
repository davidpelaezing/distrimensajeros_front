<template>
    <v-card :disabled="loading" :loading="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field v-model="form.email" :rules="rules.email" label="Correo electronico" outlined
                    required></v-text-field>
                <v-btn :disabled="!valid" block color="secondary" class="mr-4" @click="enviarEmail" rounded>
                    Enviar email de recuperación
                </v-btn>
            </v-form>
        </v-card-text>
        <v-card-actions>
            <NuxtLink to="/login">
                &lt;&lt; Volver al login
            </NuxtLink>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    data: () => ({
        form: {
            email: 'admin@divergente.net.co',
        },
        valid: true,
        rules: {
            email: [
                v => !!v || 'Ingresa un email',
                v => /.+@.+\..+/.test(v) || 'Ingresa un email valido',
            ],
        },
        loading: false,
    }),

    methods: {

        /**
         * Enviar un email de recuperación de la contraseña
         */
        async enviarEmail() {
            /* validamos que el formulario este completo, si no retornamos */
            if (!this.validate()) {
                return;
            }
            try {
                this.loading = true;
                await this.$axios.post("/auth/forgot-password", this.form);
                console.log("se ha enviado un email con el enlace para recuperar tu contraseña.")
            } catch (error) {
                console.log(error);
                console.log(error.response);
            } finally {
                this.loading = false;
            }
        },

        /** Funciones de validacion del dormulario */
        validate() {
            return this.$refs.form.validate()
        },
        reset() {
            this.$refs.form.reset()
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        },

    }
}
</script>