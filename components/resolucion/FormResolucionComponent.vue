<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">

        <v-card-title class="d-flex align-center">
            {{ editando ? 'Editar' : 'Crear' }} resolución
        </v-card-title>

        <v-card-text>

            <v-form v-model="valid" ref="form" lazy-validation>

                <v-text-field v-model="form.resolucion" :rules="rules.resolucion" label="Resolución"
                    required></v-text-field>
                <v-text-field v-model="form.prefijo" :rules="rules.prefijo" label="Prefijo" required></v-text-field>
                <v-text-field v-model="form.numero_inicial" :rules="rules.numero_inicial" label="Número inicial"
                    required></v-text-field>
                <v-text-field v-model="form.numero_final" :rules="rules.numero_final" label="Número final"
                    required></v-text-field>
                <v-text-field v-model="form.vigencia" :rules="rules.vigencia" label="Vigencia" required></v-text-field>
                <v-text-field type="date" v-model="form.fecha_inicial" :rules="rules.fecha_inicial"
                    label="Fecha inicial" required></v-text-field>
                <v-text-field type="date" v-model="form.fecha_final" :rules="rules.fecha_final" label="Fecha final"
                    required></v-text-field>

                <v-select v-model="form.parqueadero_id" :items="parqueaderos" :rules="rules.parqueaderos" item-value="_id"
                    item-text="nombre" label="Parqueadero"></v-select>

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
        resolucion: {
            default: {},
            type: Object
        },
    },

    data() {
        return {
            loading: false,
            valid: false,
            parqueaderos: [],
            form: {
                resolucion: '',
                prefijo: '',
                numero_inicial: '',
                numero_final: '',
                vigencia: '',
                fecha_inicial: '',
                fecha_final: '',
                parqueadero: '',
                parqueadero_id: ''
            },
            rules: {
                resolucion: [v => !!v || 'Este campo es requerido',],
                prefijo: [v => !!v || 'Este campo es requerido',],
                numero_inicial: [v => !!v || 'Este campo es requerido',],
                numero_final: [v => !!v || 'Este campo es requerido',],
                vigencia: [v => !!v || 'Este campo es requerido',],
                fecha_inicial: [v => !!v || 'Este campo es requerido',],
                fecha_final: [v => !!v || 'Este campo es requerido',],
                parqueadero_id: [v => !!v || 'Este campo es requerido',],
            }
        }
    },

    watch: {
        resolucion() {
            if (this.editando) {
                this.asignarData()
            }
        }
    },

    mounted() {
        if (this.editando) {
            this.asignarData()
        }
        this.getParqueaderos()
    },

    methods: {

        /**
         * Submitea el formulario
         */
        async submit() {
            try {

                const parqueadero = this.parqueaderos.find(item => item._id == this.form.parqueadero_id)
                this.form.parqueadero = parqueadero.nombre

                if (this.editando) {
                    await this.$axios.put('resolucion/editar/' + this.resolucion._id, this.form);
                } else {
                    await this.$axios.post('resolucion/crear', this.form);
                }
                this.$emit('submit')
                this.$emit('cerrar')
                this.$toast.success('Resolución creada con exito.')
                this.limpiar()
            } catch (error) {
                this.$toast.error('Error al crear resolución');
                console.log(error.response)
            }
        },

        /**
         * lista los paruqeaderos disponibles
         */
        async getParqueaderos() {
            try {
                this.loading = true;
                const { data } = await this.$axios.get('/parqueadero/listar');
                this.parqueaderos = data
            } catch (error) {
                console.log(error);
                console.log(error.response);
            } finally {
                this.loading = false;
            }
        },

        asignarData() {
            this.form = {
                resolucion: this.resolucion.resolucion,
                prefijo: this.resolucion.prefijo,
                numero_inicial: this.resolucion.numero_inicial,
                numero_final: this.resolucion.numero_final,
                vigencia: this.resolucion.vigencia,
                fecha_inicial: this.resolucion.fecha_inicial,
                fecha_final: this.resolucion.fecha_final,
                parqueadero: this.resolucion.parqueadero,
                parqueadero_id: this.resolucion.parqueadero_id,
            }
        },

        limpiar() {
            this.form = {
                resolucion: '',
                prefijo: '',
                numero_inicial: '',
                numero_final: '',
                vigencia: '',
                fecha_inicial: '',
                fecha_final: '',
                parqueadero: '',
                parqueadero_id: ''
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
