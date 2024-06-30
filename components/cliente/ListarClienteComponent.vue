<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">

        <v-data-table :headers="headers" :items="clientes">

            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="d-flex align-center">
                        Clientes
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">

                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                Nuevo cliente
                            </v-btn>
                        </template>

                        <FormClienteComponent @submit="listar()" @cerrar="dialog = false" :editando="editando" :cliente="cliente"/>

                    </v-dialog>
                </v-toolbar>
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

        <AlertComponent ref="alertComponent" />
    </v-card>
</template>
<script>
import AlertComponent from '@/components/helpers/AlertComponent'
import FormClienteComponent from '@/components/cliente/FormClienteComponent'

export default {
    components: {
        AlertComponent,
        FormClienteComponent
    },
    data: () => ({
        loading: false,
        clientes: [],
        cliente: null,
        editando: false,
        dialog: false,
        headers: [
            { text: 'id#', value: 'id' },
            { text: 'Nombre', value: 'nombre'},
            { text: 'Estado', value: 'activo'},
            { text: 'Acciones', value: 'actions', sortable: false },
        ],
    }),

    watch: {
        dialog(val) {
            if(!val){
                this.editando = false
                this.cliente = null
            }
        },
    },

    mounted() {
        this.listar()
    },

    methods: {

        /**
         * lista los clientes
         */
        async listar() {
            try {
                this.loading = true
                const { data } = await this.$axios.get('cliente/listar')
                this.clientes = data
            } catch (error) {
                console.log(error.response)
            } finally {
                this.loading = false
            }
        },

        /**
         * cambia el estado
         */
        async cambiarEstado(item){
            const request = { activo : !item.activo }
            try {
                const { data } = await this.$axios.put('cliente/cambiar-estado/' + item.id, request)
                this.$toast.success('El cliente ' + item.nombre + ' paso a estar ' + (request.activo ? "activo" : "Inactivo"))
                this.listar()
            } catch (error) {
                this.toast.error('Hubo un error al intentar cambiar el estado')
                console.log(error.response)
            }
        },

        /**
         * elimina un usuario
         */
        editar(item){
            this.editando = true
            this.cliente = item
            this.dialog = true
        }

    },
}

</script>