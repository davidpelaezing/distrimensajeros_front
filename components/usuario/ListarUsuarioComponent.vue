<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-card-text>
            <v-data-table :headers="headers" :items="usuarios" sort-by="calories">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title class="d-flex align-center">
                            Usuarios
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="800px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                    Nuevo usuario
                                </v-btn>
                            </template>
                            <!-- Form usuarios -->
                            <FormUsuarioComponent @submit="listar()" @cerrar="dialog = false"
                                :editando="editando" :usuario="usuario" />
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:[`item.actions`]="{ item }">

                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="primary" @click="editar(item)" v-bind="attrs" v-on="on">
                                mdi-pencil
                            </v-icon>
                        </template>
                        <span>Editar</span>
                    </v-tooltip>

                </template>

                <template v-slot:item.activo="{ item }">
                    <v-chip :color="item.activo ? 'success' : 'error'" @click="cambiarEstado(item)">
                        {{ item.activo ? "activo" : "Inactivo" }}
                    </v-chip>
                </template>

                <template v-slot:item.actions="{ item }">
                    <v-chip outlined @click="editar(item)">Editar</v-chip>
                </template>

            </v-data-table>
        </v-card-text>
        <AlertComponent ref="alertComponent" />
    </v-card>
</template>
<script>
import FormUsuarioComponent from "./FormUsuarioComponent.vue";
import AlertComponent from "@/components/helpers/AlertComponent";

export default {
    components: {
        FormUsuarioComponent,
        AlertComponent,
    },

    data: () => ({
        loading: false,
        dialog: false,
        editando: false,
        usuario: {},
        headers: [
            {
                text: "Nombre",
                value: "nombre",
            },
            {
                text: "Email",
                value: "email",
            },
            {
                text: "Documento",
                value: "documento",
            },
            {
                text: "Rol",
                value: "rol",
            },
            {
                text: "Estado",
                value: "activo",
            },
            {
                text: "Actions",
                value: "actions",
                sortable: false,
            },
        ],
        usuarios: [],
        roles: [],
        item: {},
        rol: [],
    }),

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
                const { data } = await this.$axios.get("usuario/listar");
                this.usuarios = data;
            } catch (error) {
                console.log(error);
            }
        },

        /**
         * cambia el estado
         */
         async cambiarEstado(item){
            const request = { activo : !item.activo }
            try {
                const { data } = await this.$axios.put('usuario/cambiar-estado/' + item.id, request)
                this.$toast.success('El usuario ' + item.nombre + ' paso a estar ' + (request.activo ? "activo" : "Inactivo"))
                this.listar()
            } catch (error) {
                this.toast.error('Hubo un error al intentar cambiar el estado')
                console.log(error.response)
            }
        },

        /**
         * edita un usuario
         */
        editar(item) {
            this.editando = true;
            this.usuario = item;
            this.dialog = true;
            console.log(item)
        },

    },
};
</script>
