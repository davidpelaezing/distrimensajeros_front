<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">

        <v-data-table :headers="headers" :items="formaPagos">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="d-flex align-center">
                        Formas de Pago
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">

                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                Nueva forma de Pago
                            </v-btn>
                        </template>

                        <FormFormaPagoComponent @submit="listar()" @cerrar="dialog = false" :editando="editando" :formaPago="formaPago"/>

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
import FormFormaPagoComponent from '@/components/formaPago/FormFormaPagoComponent'

export default {
    components: {
        AlertComponent,
        FormFormaPagoComponent
    },
    data: () => ({
        loading: false,
        formaPagos: [],
        formaPago: null,
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
                this.formaPago = null
            }
        },
    },

    mounted() {
        this.listar()
    },

    methods: {

        /**
         * lista los formaPagos
         */
        async listar() {
            try {
                this.loading = true
                const { data } = await this.$axios.get('forma-pago/listar')
                this.formaPagos = data
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
                const { data } = await this.$axios.put('forma-pago/cambiar-estado/' + item.id, request)
                this.$toast.success('El forma de pago ' + item.nombre + ' paso a estar ' + (request.activo ? "activo" : "Inactivo"))
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
            this.formaPago = item
            this.dialog = true
        }

    },
}

</script>