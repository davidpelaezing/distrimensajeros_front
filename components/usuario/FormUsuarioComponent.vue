<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-card-title class="d-flex align-center">
            {{ editando ? 'Editar' : 'Crear' }} usuario
        </v-card-title>
        <v-card-text>

            <v-form v-model="valid" ref="form" lazy-validation>
                <v-text-field v-model="form.name" :rules="rules.name" label="Nombre" required></v-text-field>
                <v-text-field v-model="form.email" :rules="rules.email" label="Email" required></v-text-field>
                <v-text-field v-if="!editando" v-model="form.password" :rules="rules.password" type="password" label="Contraseña"
                    required></v-text-field>

                <v-select v-model="form.rol" :items="roles" :rules="rules.rol" label="Rol"></v-select>
                <v-select v-model="form.parqueaderos" :items="parqueaderos" :rules="rules.parqueaderos" item-value="token"
                    item-text="nombre" label="Parqueadero" multiple></v-select>

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
            roles: ['administrador', 'supervisor', 'operario'],
            parqueaderos: [],
            form: {
                name: '',
                email: '',
                password: '',
                rol: '',
                parqueaderos: [],
            },
            rules: {
                name: [
                    v => !!v || 'Nombre es requerido',
                    v => v.length > 4 || 'El nombre debe tener almenos 4 caracteres',
                ],

                email: [
                    v => !!v || 'E-mail es requerido',
                    v => /.+@.+/.test(v) || 'Debe de ser un email valido',
                ],

                password: [
                    v => !!v || 'Contraseña es requerida',
                    v => v.length >= 8 || 'La contraseña debe tener almenos 8 caracteres',
                ],

                rol: [
                    v => !!v || 'Debes seleccionar un rol',
                ],

                parqueaderos: [
                    v => v.length > 0 || 'Debes seleccionar Al menos un parqueadero',
                ],

            }
        }
    },

    watch: {
        usuario() {
            if (this.editando) {
                this.asignarData()
            }
        }
    },

    mounted() {
        this.getParqueaderos()
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
                    await this.$axios.put('usuario/editar/' + this.usuario._id, this.form);
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

        asignarData(){
            this.form = {
                name: this.usuario.name,
                email: this.usuario.email,
                password: '',
                rol: this.usuario.rol,
                parqueaderos: this.usuario.parqueaderos,
            }
        },

        limpiar() {
            this.form = {
                name: '',
                email: '',
                password: '',
                rol: '',
                parqueaderos: '',
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
