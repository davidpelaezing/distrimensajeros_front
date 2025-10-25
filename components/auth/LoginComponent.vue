<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-card-text>

            <v-form ref="form" v-model="valid" lazy-validation>

                <v-text-field v-model="form.email" :rules="rules.email" label="Correo electronico" outlined
                    required></v-text-field>

                <v-text-field type="password" v-model="form.password" :rules="rules.password" label="Contraseña"
                    outlined required @keyup.enter="submit"></v-text-field>

                <v-btn :disabled="!valid" block color="secondary" class="mr-4" @click="submit" rounded>
                    Entrar
                </v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>
<script>
import { mapActions } from 'vuex';

export default {
    data: () => ({
        parqueaderos: [],
        form: {
            email: '',
            password: '',
        },
        valid: true,
        rules: {
            email: [
                v => !!v || 'Ingresa un email',
                v => /.+@.+\..+/.test(v) || 'Ingresa un email valido',
            ],
            password: [
                v => !!v || 'Ingresa un contraseña',
            ],
        },
        loading: false,
    }),

    methods: {
        ...mapActions('auth', ['login']),
        /**
         * Realiza el login al usuario
         */
        async submit() {
            /* validamos que el formulario este completo, si no retornamos */
            if (!this.validate()) {
                return;
            }

            try {
                this.loading = true;
                await this.login(this.form)
                this.$router.push('/');
                this.$toast.success('Bienvenido.');
            } catch (error) {
                this.$toast.error('Error al intentar autenticarse');
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
