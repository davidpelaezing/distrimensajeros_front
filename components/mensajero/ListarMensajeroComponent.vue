<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">

        <v-data-table :headers="headers" :items="mensajeros">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="d-flex align-center">
                        Mensajeros
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">

                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                Nuevo mensajero
                            </v-btn>
                        </template>

                        <FormMensajeroComponent @submit="listar()" @cerrar="dialog = false" :editando="editando" :mensajero="mensajero"/>

                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small @click="eliminar(item)">
                    mdi-pencil
                </v-icon>
            </template>
        </v-data-table>

        <AlertComponent ref="alertComponent" />
    </v-card>
</template>
<script>
import AlertComponent from '@/components/helpers/AlertComponent'
import FormMensajeroComponent from '@/components/mensajero/FormMensajeroComponent'

export default {
    components: {
        AlertComponent,
        FormMensajeroComponent
    },
    data: () => ({
        loading: false,
        mensajeros: [],
        mensajero: null,
        editando: false,
        dialog: false,
        headers: [
            { text: 'id#', value: 'id' },
            { text: 'Nombre', value: 'nombre'},
            { text: 'Acciones', value: 'actions', sortable: false },
        ],
    }),

    watch: {
        dialog(val) {
            if(!val){
                this.editando = false
                this.mensajero = null
            }
        },
    },

    mounted() {
        this.listar()
    },

    methods: {

        /**
         * lista los mensajeros
         */
        async listar() {
            try {
                this.loading = true
                const { data } = await this.$axios.get('mensajero/listar')
                this.mensajeros = data
            } catch (error) {
                console.log(error.response)
            } finally {
                this.loading = false
            }
        },

        /**
         * elimina un usuario
         */
        editar(item){
            this.editando = true
            this.mensajero = item
            this.dialog = true
        }

    },
}

</script>