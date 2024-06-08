<template>
    <v-card :disabled="loading" :loading="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field v-model="form.email" :rules="rules.email" readonly label="Correo electronico" outlined
                    :readonly="true" required></v-text-field>
                <v-text-field type="password" v-model="form.password" :rules="rules.password" label="Nueva contraseña"
                    outlined required></v-text-field>
                <v-text-field type="password" v-model="form.password_confirmation" :rules="passwordConfirmationRules"
                    label="Confirma la contraseña" outlined required></v-text-field>
                <v-btn :disabled="!valid" block color="secondary" class="mr-4" @click="resetarPassword" rounded>
                    Cambiar contraseña
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
        loading: false,
        valid: true,
        form: {
            email: null,
            password: null,
            password_confirmation: null
        },
        rules: {
            email: [
                v => !!v || 'Ingresa un email',
                v => /.+@.+\..+/.test(v) || 'Ingresa un email valido',
            ],
            password: [
                v => !!v || 'Ingresa una contraseña',
            ],
        },
    }),

    mounted() {
        this.form.email = this.email
    },

    computed: {
        token() {
            return this.$route.query.token;
        },
        email() {
            return this.$route.query.email;
        },
        passwordConfirmationRules() {
            return [
                v => !!v || 'Confirma tu contraseña',
                v => v === this.form.password || 'las contraseñas no coinciden'
            ]
        }
    },

    methods: {

        /**
         * cambia la contraseña actual
         */
        async resetarPassword() {
            try {
                /* validamos que el formulario este completo, si no retornamos */
                if (!this.validate()) {
                    return;
                }
                /* Creamos el objeto para enviar */
                const request = {
                    token: this.token,
                    ...this.form
                }
                console.log(request);
                const response = await this.$axios.post('/resetear-password', request);
                this.$router.push('/');
                console.log(response)
            } catch (error) {
                console.log(error)
                console.log(error.response)
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