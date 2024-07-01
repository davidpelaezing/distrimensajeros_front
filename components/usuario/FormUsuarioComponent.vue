<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-card-title class="d-flex align-center">
            {{ editando ? 'Editar' : 'Crear' }} usuario
        </v-card-title>
        <v-card-text>

            <v-form v-model="valid" ref="form" lazy-validation @submit.prevent="submit">
                <v-text-field v-model="form.nombre" :rules="rules.nombre" label="Nombre" required></v-text-field>
                <v-text-field v-model="form.email" :rules="rules.email" label="Email" required></v-text-field>
                <v-text-field v-model="form.documento" :rules="rules.documento" label="Documento" required></v-text-field>
                <v-select v-model="form.rol" :items="roles" :rules="rules.rol" label="Rol"></v-select>
            </v-form>

        </v-card-text>

        <v-card-actions>
            <v-btn color="primary" @click="submit">{{ editando ? 'Actualizar' : 'Crear' }}</v-btn>
            <v-btn color="error" @click="$emit('cerrar')">Cancelar</v-btn>
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
        usuario: {
            type: Object,
            default: {}
        }
    },

    data() {
        return {
            loading: false,
            valid: false,
            roles: ['administrador', 'operario'],
            form: {
                nombre: '',
                email: '',
                documento: '',
                rol: '',
            },
            rules: {
                nombre: [
                    v => !!v || 'Nombre es requerido',
                    v => v.length > 4 || 'El nombre debe tener almenos 4 caracteres',
                ],

                email: [
                    v => !!v || 'E-mail es requerido',
                    v => /.+@.+/.test(v) || 'Debe de ser un email valido',
                ],

                documento: [
                    v => !!v || 'Documento es requerido',
                    v => v.length >= 8 || 'El documento debe tener almenos 8 caracteres',
                ],

                rol: [
                    v => !!v || 'Debes seleccionar un rol',
                ],
            }
        }
    },

    watch: {
        editando(val){
            if(val){
                this.asignarData();
            } else {
                this.limpiar();
            }
        }
    },

    mounted() {
        if(this.editando){
            this.asignarData()
        }
    },

    methods: {

        /**
         * Submitea el formulario
         */
        async submit() {
            try {
                if(this.editando){
                    await this.$axios.put('usuario/actualizar/' + this.usuario.id, this.form);
                } else {
                    await this.$axios.post('usuario/crear', this.form);
                }
                this.$emit('submit')
                this.$emit('cerrar')
                this.$toast.success('Usuario creado con exito.')
                this.limpiar()
            } catch (error) {
                this.$toast.error('Error al crear usuario');
                console.log(error.response)
            }
        },

        asignarData(){
            this.form = {
                nombre: this.usuario.nombre,
                email: this.usuario.email,
                documento: this.usuario.documento,
                rol: this.usuario.rol,
            }
        },

        limpiar() {
            this.form = {
                nombre: '',
                email: '',
                documento: '',
                rol: '',
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
