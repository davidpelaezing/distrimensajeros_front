<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-card-title class="d-flex align-center">
            <v-img src="iso2.png" max-width="45"></v-img>
            Crear cliente
        </v-card-title>
        <v-card-text>

            <v-form v-model="valid" ref="form" lazy-validation>
                <v-select :items="tipo_personas" v-model="form.tipo_persona" :rules="rules.tipo_persona"
                    label="Tipo persona"></v-select>
                <v-select :items="tipo_identificaciones" v-model="form.tipo_identificacion"
                    :rules="rules.tipo_identificacion" label="Tipo Identificación"></v-select>

                <v-text-field v-model="form.identificacion" :rules="rules.identificacion" label="identificación"
                    required></v-text-field>

                <v-text-field v-model="form.nombre" :rules="rules.nombre" label="Primer nombre" required
                    v-if="form.tipo_persona === 'Natural'"></v-text-field>
                <v-text-field v-model="form.nombre_2" :rules="rules.nombre_2" label="Segundo nombre" required
                    v-if="form.tipo_persona === 'Natural'"></v-text-field>
                <v-text-field v-model="form.apellido" :rules="rules.apellido" label="Apellido" required
                    v-if="form.tipo_persona === 'Natural'"></v-text-field>
                <v-text-field v-model="form.apellido_2" :rules="rules.apellido_2" label="Segundo apellido" required
                    v-if="form.tipo_persona === 'Natural'"></v-text-field>
                <v-text-field v-model="form.razon_social" :rules="rules.razon_social" label="Razón social" required
                    v-if="form.tipo_persona === 'Jurídica'"></v-text-field>
                <v-text-field v-model="form.direccion" :rules="rules.direccion" label="Dirección" required
                    v-if="form.tipo_persona === 'Jurídica'"></v-text-field>
                <v-text-field v-model="form.celular" :rules="rules.celular" label="Célular" required
                    v-if="form.tipo_persona === 'Jurídica'"></v-text-field>
                <v-text-field v-model="form.email" :rules="rules.email" label="Email" required></v-text-field>

            </v-form>

        </v-card-text>

        <v-card-actions>
            <v-btn color="primary" @click="submit">Crear</v-btn>
            <v-btn color="error" @click="$emit('cerrar')">Cancelar</v-btn>
        </v-card-actions>

    </v-card>
</template>
<script>

export default {

    data() {
        return {
            loading: false,
            valid: false,
            tipo_personas: ['Jurídica', 'Natural'],
            tipo_identificaciones: ['Cedula', 'NIT', 'Pasaporte'],
            form: {
                tipo_persona: 0,
                tipo_identificacion: 0,
                identificacion: '',
                nombre: '',
                nombre_2: '',
                apellido: '',
                apellido_2: '',
                razon_social: '',
                direccion: '',
                celular: '',
                email: '',
            },
            rules: {
                nombre: [
                ],
                nombre_2: [
                ],
                apellido: [
                ],
                apellido_2: [
                ],
                tipo_persona: [
                    v => !!v || 'Este campo es requerido',
                ],
                tipo_identificacion: [
                    v => !!v || 'Identidicacion es requerida',
                ],
                identificacion: [
                    v => !!v || 'Identidicacion es requerido',
                ],
                razon_social: [
                ],
                direcccion: [
                ],
                email: [
                ],
                celular: [
                ],
            }
        }
    },

    methods: {

        /**
         * Submitea el formulario
         */
        async submit() {
            try {
                await this.$axios.post('cliente/crear', this.form);
                this.$emit('submit')
                this.$emit('cerrar')
                this.$toast.success('Cliente creado con exito.')
                this.limpiar()
            } catch (error) {
                this.$toast.error(error.response.data.error);
                console.log(error)
                console.log(error.response)
            }
        },

        limpiar() {
            this.form.tipo_persona = null
            this.form.tipo_identificacion = null
            this.form.identificacion = ''
            this.form.nombre = ''
            this.form.nombre_2 = ''
            this.form.apellido = ''
            this.form.apellido_2 = ''
            this.form.razon_social = ''
            this.form.direccion = ''
            this.form.celular = ''
            this.form.email = ''
            this.resetValidation()
        },

        validate() {
            this.$refs.form.validate()
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
