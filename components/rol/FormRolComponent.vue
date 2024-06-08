<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-card-title class="d-flex align-center">
            <v-img src="iso2.png" max-width="45"></v-img>
            Crear rol
        </v-card-title>
        <v-card-text>

            <v-form v-model="valid" ref="form" lazy-validation>
                <v-text-field v-model="form.nombre" :rules="rules.nombre" label="Nombre" required></v-text-field>
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
            form: {
                nombre: '',
            },
            rules: {
                nombre: [
                    v => !!v || 'Nombre del rol es requerido',
                    v => v.length >= 3 || 'El nombre debe tener almenos 8 caracteres',
                ]
            }
        }
    },

    methods: {

        /**
         * Submitea el formulario
         */
        async submit() {
          if (!this.$refs.form.validate()) {
            return
          }
            try {
                await this.$axios.post('rol/crear', this.form);
                this.$emit('submit')
                this.$emit('cerrar')
                this.limpiar()
            } catch (error) {
                // console.log(error)
                console.log(error.response.data.message)
                console.log(error);
            }
        },

        limpiar() {
            this.form.nombre = ''
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
