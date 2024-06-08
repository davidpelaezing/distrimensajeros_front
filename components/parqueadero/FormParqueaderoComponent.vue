<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">

        <v-card-title class="d-flex align-center">
            {{ editando ? 'Editar' : 'Crear' }} parqueadero
        </v-card-title>

        <v-card-text>

            <v-form v-model="valid" ref="form" lazy-validation>

                <v-text-field v-model="form.nombre" :rules="rules.nombre" label="Nombre" required></v-text-field>
                <v-text-field v-model="form.direccion" :rules="rules.direccion" label="Dirección" required></v-text-field>

            </v-form>

        </v-card-text>

        <v-card-actions>
            <v-btn color="primary" @click="submit">{{ editando ? 'Editar' : 'Crear' }}</v-btn>
            <v-btn color="error" @click="$emit('cerrar')">Cancelar</v-btn>
        </v-card-actions>

    </v-card>
</template>
<script>

export default {

    props: {
        editando: {
            default: false,
            type: Boolean
        },
        parqueadero: {
            default: {},
            type: Object
        }
    },

    data() {
        return {
            loading: false,
            valid: false,
            form: {
                nombre: '',
                direccion: '',
            },
            rules: {
                nombre: [v => !!v || 'Este campo es requerido'],
                direccion: [v => !!v || 'Este campo es requerido'],
            }
        }
    },

    watch: {
        parqueadero() {
            if (this.editando) {
                this.asignarData()
            }
        }
    },

    mounted() {
        if (this.editando) {
            this.asignarData()
        }
    },

    methods: {

        /**
         * Submitea el formulario
         */
        async submit() {
            try {
                if (this.editando) {
                    await this.$axios.put('parqueadero/editar/' + this.parqueadero._id, this.form);
                } else {
                    const request = {
                        nombre: this.form.nombre,
                        direccion: this.form.direccion,
                        token: this.generarCadenaAleatoria(30)
                    }
                    await this.$axios.post('parqueadero/crear', request);
                }
                this.$emit('submit')
                this.$emit('cerrar')
                this.$toast.success('Parqueadero creado con exito.')
                this.limpiar()
            } catch (error) {
                this.$toast.error('Error al crear el parqueadero');
                console.log(error.response)
            }
        },

        generarCadenaAleatoria(longitud) {
            const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let resultado = '';
            for (let i = 0; i < longitud; i++) {
                const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
                resultado += caracteres.charAt(indiceAleatorio);
            }
            return resultado;
        },

        asignarData() {
            this.form = {
                nombre: this.parqueadero.nombre,
                direccion: this.parqueadero.direccion,
            }
        },

        limpiar() {
            this.form = {
                nombre: '',
                direccion: ''
            }
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
