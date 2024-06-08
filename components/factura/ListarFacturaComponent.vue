<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-card-text>
            <v-data-table :headers="headers" :items="facturas" :search="search" sort-by="calories">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title class="d-flex align-center">
                            Facturas
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>

                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                    Nueva factura
                                </v-btn>
                            </template>
                            <FormFacturaComponent 
                                @cerrar="dialog = false"
                                :editando="editando"
                                :factura="factura"
                                >
                            </FormFacturaComponent>
                        </v-dialog>
                    </v-toolbar>


                    <v-text-field v-model="search" label="Buscar ..."></v-text-field>

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

                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon color="primary" @click="dialogCerrarFactura = true" v-bind="attrs" v-on="on">
                                mdi-hand-okay
                            </v-icon>
                        </template>
                        <span>Cerrar</span>
                    </v-tooltip>
                </template>

            </v-data-table>

            <v-dialog v-model="dialogCerrarFactura">
                <FormCerrarFacturaComponent @cerrar="dialogCerrarFactura = false"/>
            </v-dialog>


        </v-card-text>

        <AlertComponent ref="alertComponent" />

    </v-card>
</template>
<script>

import AlertComponent from "@/components/helpers/AlertComponent";
import FormFacturaComponent from "@/components/factura/FormFacturaComponent";
import FormCerrarFacturaComponent from "@/components/factura/FormCerrarFacturaComponent";

import { mapGetters, mapState } from "vuex";

export default {
    components: {
        AlertComponent,
        FormFacturaComponent,
        FormCerrarFacturaComponent
    },

    data: () => ({
        factura: {},
        editando: false,
        loading: false,
        search: '',
        dialog: false,
        dialogCerrarFactura: false,
        headers: [
            {
                text: "Fecha",
                value: "fecha",
            },
            {
                text: "Nro factura",
                value: "factura",
                sortable: false,
            },
            {
                text: "Recibo",
                value: "recibo",
                sortable: false,
            },
            {
                text: "Mensajero",
                value: "mensajero_id",
                sortable: false,
            },
            {
                text: "Cliente",
                value: "cliente_id",
                sortable: false,
            },
            {
                text: "Valor",
                value: "valor",
            },
            {
                text: "Actions",
                value: "actions",
                sortable: false,
            }
        ],
    }),

    watch:{
        dialog(valor){
            if(!valor){
                this.editando = false;
                this.factura = {};
            }
        }
    },

    computed: {
        ...mapState('factura', ['facturas'])
    },

    methods: {
        ...mapGetters('auth', ['userAuthenticated']),

        editar(item){
            this.dialog = true;
            this.editando = true;
            this.factura = item;
        },

    }
};
</script>
