<template>
    <v-card flat class="rounded-xl overflow-hidden">
        <div class="d-flex align-center px-6 pt-6 pb-2">
            <v-avatar size="42" rounded="lg" color="primary lighten-5" class="mr-3">
                <v-icon color="primary">{{ editando ? 'mdi-pencil-outline' : 'mdi-plus' }}</v-icon>
            </v-avatar>
            <div>
                <div class="text-h6 font-weight-bold">{{ editando ? 'Editar' : 'Nuevo' }} cliente</div>
                <div class="text-caption grey--text text--darken-1">
                    {{ editando ? 'Actualiza la información registrada' : 'Completa los datos para registrarlo' }}
                </div>
            </div>
            <v-spacer></v-spacer>
            <v-btn icon @click="$emit('cerrar')">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </div>

        <v-card-text class="px-6 pt-5 pb-2">
            <v-form v-model="valid" ref="form" lazy-validation :disabled="loading" @submit.prevent="submit">
                <v-text-field label="Nombre" v-model="form.nombre" :rules="rules.nombre" outlined
                    prepend-inner-icon="mdi-account-outline" autofocus></v-text-field>
            </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="px-6 py-4">
            <v-spacer></v-spacer>
            <v-btn text class="px-4" @click="$emit('cerrar')">Cancelar</v-btn>
            <v-btn color="primary" depressed class="rounded-lg px-5" :loading="loading" @click="submit">
                <v-icon left small>mdi-content-save-outline</v-icon>
                {{ editando ? 'Guardar cambios' : 'Crear' }}
            </v-btn>
        </v-card-actions>

    </v-card>
</template>
<script>

export default {

    props: {
        editando: {
            type: Boolean,
            default: false
        },
        cliente: {
            type: Object,
            default: null
        }
    },

    data() {
        return {
            loading: false,
            valid: false,
            form: {
                nombre: null
            },
            rules: {
                nombre: [v => !!v || 'El nombre es requerido']
            }
        }
    },

    watch: {
        editando(val) {
            if (val) {
                this.asignarData();
            } else {
                this.limpiar();
            }
        }
    },

    mounted() {
        if (this.editando) {
            this.asignarData();
        }
    },

    methods: {

        /**
         * Submitea el formulario
         */
        async submit() {
            try {
                if (!this.$refs.form.validate()) {
                    return;
                }
                this.loading = true;
                if (this.editando) {
                    await this.$axios.put('cliente/actualizar/' + this.cliente.id, this.form);
                    this.$toast.success('Cliente actualizado con exito.')
                } else {
                    await this.$axios.post('cliente/crear', this.form);
                    this.$toast.success('Cliente creado con exito.')
                }
                this.$emit('submit')
                this.$emit('cerrar')
                this.limpiar()
            } catch (error) {
                this.$toast.error(error.response.data.error);
                console.log(error.response)
            } finally {
                this.loading = false;
            }
        },

        asignarData() {
            this.form.nombre = this.cliente.nombre
        },

        limpiar() {
            this.form.nombre = null
            this.$refs.form.resetValidation()
        },

    }
}

</script>
