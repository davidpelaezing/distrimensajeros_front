<template>
    <v-form ref="form" v-model="valid" lazy-validation :disabled="loading" @submit.prevent="submit">

        <label class="text-body-2 font-weight-medium grey--text text--darken-3">Correo electrónico</label>
        <v-text-field v-model="form.email" :rules="rules.email" placeholder="tucorreo@empresa.com" outlined
            prepend-inner-icon="mdi-email-outline" background-color="white" class="mt-1" autocomplete="username"
            required></v-text-field>

        <label class="text-body-2 font-weight-medium grey--text text--darken-3">Contraseña</label>
        <v-text-field :type="verPassword ? 'text' : 'password'" v-model="form.password" :rules="rules.password"
            placeholder="••••••••" outlined prepend-inner-icon="mdi-lock-outline" background-color="white"
            :append-icon="verPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
            @click:append="verPassword = !verPassword" class="mt-1" autocomplete="current-password"
            required></v-text-field>

        <v-btn type="submit" :disabled="!valid" :loading="loading" block x-large depressed color="primary"
            class="rounded-lg mt-2">
            Entrar
            <v-icon right>mdi-arrow-right</v-icon>
        </v-btn>
    </v-form>
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
        verPassword: false,
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
