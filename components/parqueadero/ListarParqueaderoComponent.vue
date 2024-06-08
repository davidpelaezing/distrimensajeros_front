<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-data-table :headers="headers" :items="parqueaderos">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="d-flex align-center">
                        Parqueaderos
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                Nueva parqueadero
                            </v-btn>
                        </template>

                        <FormParqueaderoComponent :editando="editando" :parqueadero="parqueadero" @submit="listar()"
                            @cerrar="dialog = false" />

                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">

                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="primary" @click="editar(item)" v-bind="attrs" v-on="on">
                            mdi-pencil
                        </v-icon>
                    </template>
                    <span>Editar</span>
                </v-tooltip>
                
            </template>
        </v-data-table>
        <AlertComponent ref="alertComponent" />
    </v-card>
</template>
<script>
import AlertComponent from '@/components/helpers/AlertComponent'
import FormParqueaderoComponent from '@/components/parqueadero/FormParqueaderoComponent'

export default {
    components: {
        AlertComponent,
        FormParqueaderoComponent
    },
    data: () => ({
        loading: false,
        editando: false,
        parqueadero: {},
        parqueaderos: [],
        dialog: false,
        headers: [
            { text: 'Parqueadero', value: 'nombre' },
            { text: 'Dirección', value: 'direccion' },
            { text: 'Token', value: 'token' },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
    }),

    watch: {
        dialog(val) {
            if (!val) {
                this.editando = false;
                this.parqueadero = {}
            }
        },
    },

    mounted() {
        this.listar()
    },

    methods: {

        /**
         * lista los parqueaderos
         */
        async listar() {
            try {
                const { data } = await this.$axios.get('parqueadero/listar')
                this.parqueaderos = data
            } catch (error) {
                console.log(error)
            }
        },

        /**
         * elimina un usuario
         */
        async eliminar(item) {
            try {
                const confirmacion = await this.$refs.alertComponent.show('No se podra recuperar el registro.');
                if (confirmacion) {
                    await this.$axios.delete('parqueadero/' + item._id)
                }
                this.listar()
            } catch (error) {
                console.log(error)
                console.log(error.response)
            }
        },

        /**
         * editar
         */
        editar(item) {
            this.editando = true
            this.parqueadero = item
            this.dialog = true;
        },
    },
}

</script>