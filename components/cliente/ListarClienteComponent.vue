<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">

        <v-tabs v-model="tab" align-with-title>
            <v-tabs-slider color="secondary"></v-tabs-slider>

            <v-tab v-for="tab in tabs" :key="tab">
                {{ tab }}
            </v-tab>
        </v-tabs>

        <v-data-table v-if="tab === 0" :headers="headers_natural"
            :items="clientes.filter(item => item.tipo_persona === 'Natural')">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="d-flex align-center">
                        <v-img src="iso2.png" max-width="45"></v-img>
                        Clientes Naturales
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                Nuevo cliente
                            </v-btn>
                        </template>

                        <FormClienteComponent @submit="listar()" @cerrar="dialog = false" />

                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">

                <v-icon small @click="eliminar(item)">
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>

        <v-data-table v-if="tab === 1" :headers="headers_juridica"
            :items="clientes.filter(item => item.tipo_persona === 'Jurídica')">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="d-flex align-center">
                        <v-img src="iso2.png" max-width="45"></v-img>
                        Clientes Juridicos
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                Nuevo cliente
                            </v-btn>
                        </template>
                        <FormClienteComponent @submit="listar()" @cerrar="dialog = false" />
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small @click="eliminar(item)">
                    mdi-delete
                </v-icon>
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
        dialog: false,
        tab: null,
        tabs: ['Naturales', 'Juridica'],
        headers_natural: [
            { text: 'Tipo persona', value: 'tipo_persona' },
            { text: 'Tipo Identificación', value: 'tipo_identificacion' },
            { text: 'Identificación', value: 'identificacion' },
            { text: 'Primer nombre', value: 'nombre' },
            { text: 'Segundo nombre', value: 'nombre_2' },
            { text: 'Primer apellido', value: 'apellido' },
            { text: 'Segundo apellido', value: 'apellido_2' },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        headers_juridica: [
            { text: 'Tipo persona', value: 'tipo_persona' },
            { text: 'Tipo Identificación', value: 'tipo_identificacion' },
            { text: 'Identificación', value: 'identificacion' },
            { text: 'Razón social', value: 'razon_social' },
            { text: 'Dirección', value: 'direccion' },
            { text: 'Email', value: 'email' },
            { text: 'Celular', value: 'celular' },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
    }),

    watch: {
        dialog(val) {

        },
    },

    created() {
        this.listar()
    },

    methods: {

        /**
         * lista los clientes
         */
        async listar() {
            try {
                const { data } = await this.$axios.get('cliente/listar')
                this.clientes = data
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
                    await this.$axios.delete('cliente/' + item._id)
                }

                this.listar()
            } catch (error) {
                console.log(error)
                console.log(error.response)
            }
        }

    },
}

</script>