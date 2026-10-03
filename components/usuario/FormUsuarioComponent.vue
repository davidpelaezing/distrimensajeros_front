<template>
    <v-card flat class="rounded-xl overflow-hidden">
        <div class="d-flex align-center px-6 pt-6 pb-2">
            <v-avatar size="42" rounded="lg" color="primary lighten-5" class="mr-3">
                <v-icon color="primary">{{ editando ? 'mdi-account-edit-outline' : 'mdi-account-plus-outline' }}</v-icon>
            </v-avatar>
            <div>
                <div class="text-h6 font-weight-bold">{{ editando ? 'Editar' : 'Nuevo' }} usuario</div>
                <div class="text-caption grey--text text--darken-1">
                    {{ editando ? 'Actualiza los datos y el rol del usuario' : 'Registra un nuevo usuario con acceso al sistema' }}
                </div>
            </div>
            <v-spacer></v-spacer>
            <v-btn icon @click="$emit('cerrar')">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </div>

        <v-card-text class="px-6 pt-5 pb-2">
            <v-form v-model="valid" ref="form" lazy-validation :disabled="loading" @submit.prevent="submit">
                <v-row dense>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="form.nombre" :rules="rules.nombre" label="Nombre" outlined
                            prepend-inner-icon="mdi-account-outline" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="form.documento" :rules="rules.documento" label="Documento" outlined
                            prepend-inner-icon="mdi-card-account-details-outline" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="form.email" :rules="rules.email" label="Email" outlined
                            prepend-inner-icon="mdi-email-outline" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-select v-model="form.rol" :items="roles" :rules="rules.rol" label="Rol" outlined
                            prepend-inner-icon="mdi-shield-account-outline">
                            <template v-slot:selection="{ item }">
                                <span class="text-capitalize">{{ item }}</span>
                            </template>
                            <template v-slot:item="{ item }">
                                <span class="text-capitalize">{{ item }}</span>
                            </template>
                        </v-select>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions class="px-6 py-4">
            <v-spacer></v-spacer>
            <v-btn text class="px-4" @click="$emit('cerrar')">Cancelar</v-btn>
            <v-btn color="primary" depressed class="rounded-lg px-5" :loading="loading" @click="submit">
                <v-icon left small>mdi-content-save-outline</v-icon>
                {{ editando ? 'Actualizar' : 'Crear' }}
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
        usuario: {
            type: Object,
            default: () => ({})
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
                this.loading = true;
                if(this.editando){
                    await this.$axios.put('usuario/actualizar/' + this.usuario.id, this.form);
                } else {
                    await this.$axios.post('usuario/crear', this.form);
                }
                this.$emit('submit')
                this.$emit('cerrar')
                this.$toast.success(this.editando ? 'Usuario actualizado con exito.' : 'Usuario creado con exito.')
                this.limpiar()
            } catch (error) {
                this.$toast.error(this.editando ? 'Error al actualizar usuario' : 'Error al crear usuario');
                console.log(error.response)
            } finally {
                this.loading = false;
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
