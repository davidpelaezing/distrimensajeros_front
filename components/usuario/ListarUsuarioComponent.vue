<template>
    <div>
        <PageHeaderComponent title="Usuarios" subtitle="Controla quién accede al sistema y con qué rol"
            icon="mdi-account-multiple">
            <v-btn color="primary" depressed large class="rounded-lg px-5" @click="nuevo">
                <v-icon left>mdi-account-plus-outline</v-icon>
                Nuevo usuario
            </v-btn>
        </PageHeaderComponent>

        <ResumenComponent :items="resumen" :loading="loading && !usuarios.length" />

        <v-card flat class="rounded-xl overflow-hidden fade-up" style="animation-delay: 320ms">
            <v-card-title class="px-5 py-4">
                <span class="text-subtitle-1 font-weight-bold">Listado de usuarios</span>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Buscar..." outlined dense
                    hide-details clearable class="mt-2 mt-sm-0" style="max-width: 280px"></v-text-field>
            </v-card-title>
            <v-divider></v-divider>

            <v-data-table :headers="headers" :items="usuarios" :search="search" :loading="loading"
                loading-text="Cargando usuarios..." no-data-text="Aún no hay usuarios registrados"
                no-results-text="No se encontraron coincidencias">

                <template v-slot:[`item.nombre`]="{ item }">
                    <div class="d-flex align-center py-2">
                        <v-avatar size="36" color="primary" class="mr-3">
                            <span class="white--text text-caption font-weight-bold">{{ iniciales(item.nombre) }}</span>
                        </v-avatar>
                        <span class="font-weight-medium">{{ item.nombre }}</span>
                    </div>
                </template>

                <template v-slot:[`item.email`]="{ item }">
                    <span class="grey--text text--darken-2">{{ item.email }}</span>
                </template>

                <template v-slot:[`item.rol`]="{ item }">
                    <v-chip small label :color="rolInfo(item.rol).bg" :text-color="rolInfo(item.rol).color"
                        class="font-weight-medium text-capitalize">
                        <v-icon x-small left>{{ rolInfo(item.rol).icon }}</v-icon>
                        {{ item.rol }}
                    </v-chip>
                </template>

                <template v-slot:[`item.activo`]="{ item }">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-chip small v-bind="attrs" v-on="on" @click="cambiarEstado(item)"
                                :color="item.activo ? 'green lighten-5' : 'red lighten-5'"
                                :text-color="item.activo ? 'green darken-3' : 'red darken-3'" class="font-weight-medium">
                                <v-icon x-small left>mdi-circle</v-icon>
                                {{ item.activo ? 'Activo' : 'Inactivo' }}
                            </v-chip>
                        </template>
                        <span>Clic para {{ item.activo ? 'desactivar' : 'activar' }}</span>
                    </v-tooltip>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <div class="d-flex justify-end">
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon small color="primary" v-bind="attrs" v-on="on" @click="editar(item)">
                                    <v-icon small>mdi-pencil-outline</v-icon>
                                </v-btn>
                            </template>
                            <span>Editar</span>
                        </v-tooltip>
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon small color="orange darken-2" v-bind="attrs" v-on="on"
                                    @click="restablecer(item)">
                                    <v-icon small>mdi-lock-reset</v-icon>
                                </v-btn>
                            </template>
                            <span>Restablecer contraseña</span>
                        </v-tooltip>
                    </div>
                </template>

            </v-data-table>
        </v-card>

        <!-- Form usuarios -->
        <v-dialog v-model="dialog" max-width="720px" content-class="rounded-xl">
            <FormUsuarioComponent @submit="listar()" @cerrar="dialog = false" :editando="editando" :usuario="usuario" />
        </v-dialog>

        <AlertComponent ref="alertComponent" />

        <!-- RESTABLECER CONTRASEÑA -->
        <v-dialog v-model="dialogPassword" max-width="460px" content-class="rounded-xl">
            <v-card flat class="rounded-xl overflow-hidden">
                <div class="d-flex align-center px-6 pt-6 pb-2">
                    <v-avatar size="42" rounded="lg" color="orange lighten-5" class="mr-3">
                        <v-icon color="orange darken-2">mdi-lock-reset</v-icon>
                    </v-avatar>
                    <div>
                        <div class="text-h6 font-weight-bold">Restablecer contraseña</div>
                        <div class="text-caption grey--text text--darken-1">{{ usuarioSeleccionado?.nombre }}</div>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="dialogPassword = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </div>

                <v-card-text class="px-6 pt-5 pb-2">
                    <v-form ref="formPassword" @submit.prevent="enviarRestablecer">
                        <v-text-field v-model="password" :rules="rules.password" label="Nueva contraseña"
                            :type="verPassword ? 'text' : 'password'" outlined prepend-inner-icon="mdi-lock-outline"
                            :append-icon="verPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                            @click:append="verPassword = !verPassword" required />

                        <v-text-field v-model="password_confirmation"
                            :rules="[v => !!v || 'La confirmación es obligatoria.', v => v === password || 'Las contraseñas no coinciden.']"
                            label="Confirmar contraseña" :type="verPassword ? 'text' : 'password'" outlined
                            prepend-inner-icon="mdi-lock-check-outline" required />

                        <v-alert dense text type="info" class="text-caption mb-0" icon="mdi-information-outline">
                            Mínimo 6 caracteres e incluir al menos una letra mayúscula.
                        </v-alert>
                    </v-form>
                </v-card-text>

                <v-divider class="mt-4"></v-divider>

                <v-card-actions class="px-6 py-4">
                    <v-spacer></v-spacer>
                    <v-btn text class="px-4" @click="dialogPassword = false">Cancelar</v-btn>
                    <v-btn color="primary" depressed class="rounded-lg px-5" :loading="guardandoPassword"
                        @click="enviarRestablecer()">
                        <v-icon left small>mdi-content-save-outline</v-icon>
                        Guardar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
import FormUsuarioComponent from "./FormUsuarioComponent.vue";
import AlertComponent from "@/components/helpers/AlertComponent";
import PageHeaderComponent from "@/components/helpers/PageHeaderComponent";
import ResumenComponent from "@/components/helpers/ResumenComponent";

export default {
    components: {
        FormUsuarioComponent,
        AlertComponent,
        PageHeaderComponent,
        ResumenComponent,
    },

    data: () => ({
        loading: false,
        search: '',
        dialog: false,
        editando: false,
        usuario: {},
        rules: {
            password: [
                v => !!v || 'La contraseña es obligatoria.',
                v => (v || '').length >= 6 || 'La contraseña debe tener al menos 6 caracteres.',
                v => /[A-Z]/.test(v) || 'La contraseña debe contener al menos una letra mayúscula.',
            ],
        },
        headers: [
            { text: "Nombre", value: "nombre" },
            { text: "Email", value: "email" },
            { text: "Documento", value: "documento" },
            { text: "Rol", value: "rol" },
            { text: "Estado", value: "activo", width: 140 },
            { text: "Acciones", value: "actions", sortable: false, align: 'end', width: 110 },
        ],
        usuarios: [],
        dialogPassword: false,
        verPassword: false,
        guardandoPassword: false,
        password: '',
        password_confirmation: '',
        usuarioSeleccionado: null,
    }),

    computed: {
        /**
         * Totales para las tarjetas de resumen
         */
        resumen() {
            const total = this.usuarios.length
            const activos = this.usuarios.filter(u => u.activo).length
            const admins = this.usuarios.filter(u => u.rol === 'administrador').length
            return [
                { label: 'Total usuarios', value: total, icon: 'mdi-account-group-outline', color: 'primary', bg: 'primary lighten-5' },
                { label: 'Activos', value: activos, icon: 'mdi-account-check-outline', color: 'green darken-2', bg: 'green lighten-5' },
                { label: 'Administradores', value: admins, icon: 'mdi-shield-account-outline', color: 'orange darken-2', bg: 'orange lighten-5' },
            ]
        },
    },

    watch: {
        dialog(val) {
            if (!val) {
                this.editando = false;
                this.usuario = {};
            }
        },
    },

    created() {
        this.listar();
    },

    methods: {
        /**
         * lista los usuarios
         */
        async listar() {
            try {
                this.loading = true;
                const { data } = await this.$axios.get("usuario/listar");
                this.usuarios = data;
            } catch (error) {
                console.log(error);
            } finally {
                this.loading = false;
            }
        },

        /**
         * cambia el estado
         */
        async cambiarEstado(item) {
            const request = { activo: !item.activo }
            try {
                await this.$axios.put('usuario/cambiar-estado/' + item.id, request)
                this.$toast.success('El usuario ' + item.nombre + ' paso a estar ' + (request.activo ? "activo" : "Inactivo"))
                this.listar()
            } catch (error) {
                this.$toast.error('Hubo un error al intentar cambiar el estado')
                console.log(error.response)
            }
        },

        /**
         * abre el formulario para crear
         */
        nuevo() {
            this.editando = false;
            this.usuario = {};
            this.dialog = true;
        },

        /**
         * edita un usuario
         */
        editar(item) {
            this.editando = true;
            this.usuario = item;
            this.dialog = true;
        },

        /**
         * restablece la contraseña y abre el dialogo
         */
        restablecer(item) {
            this.usuarioSeleccionado = item;
            this.password = '';
            this.password_confirmation = '';
            this.verPassword = false;
            this.dialogPassword = true;
            this.$nextTick(() => this.$refs.formPassword && this.$refs.formPassword.resetValidation());
        },

        async enviarRestablecer() {
            if (this.$refs.formPassword && !this.$refs.formPassword.validate()) {
                return;
            }
            if (this.password !== this.password_confirmation) {
                this.$toast.error('Las contraseñas no coinciden');
                return;
            }

            try {
                this.guardandoPassword = true;
                await this.$axios.put(`usuario/restablecer-password/${this.usuarioSeleccionado.id}`, {
                    password: this.password,
                    password_confirmation: this.password_confirmation,
                });
                this.$toast.success('Contraseña restablecida correctamente');
                this.dialogPassword = false;
            } catch (error) {
                this.$toast.error('Error al restablecer la contraseña');
                console.error(error);
            } finally {
                this.guardandoPassword = false;
            }
        },

        /**
         * color e icono según el rol
         */
        rolInfo(rol) {
            const roles = {
                administrador: { icon: 'mdi-shield-account', color: 'primary', bg: 'primary lighten-5' },
                supervisor: { icon: 'mdi-account-tie', color: 'orange darken-3', bg: 'orange lighten-5' },
                operario: { icon: 'mdi-account-cog', color: 'blue-grey darken-2', bg: 'blue-grey lighten-5' },
            }
            return roles[rol] || roles.operario
        },

        /**
         * iniciales para el avatar
         */
        iniciales(nombre) {
            if (!nombre) return '?'
            return nombre.trim().split(/\s+/).slice(0, 2).map(p => p.charAt(0)).join('').toUpperCase()
        },
    },
};
</script>
