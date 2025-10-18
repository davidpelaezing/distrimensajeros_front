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
                                @submit="listarDespachadas()"
                                :editando="editando"
                                :factura="factura"
                                />
                        </v-dialog>
                    </v-toolbar>


                    <v-text-field v-model="search" label="Buscar ..."></v-text-field>

                </template>

                <template v-slot:item.actions="{ item }">

                    <v-chip outlined @click="editar(item)">Editar</v-chip>
                    <v-chip color="primary" outlined @click="cerrarFactura(item)">Cerrar</v-chip>

                </template>

            </v-data-table>

            <v-dialog v-model="dialogCerrarFactura" max-width="700px">
                <FormCerrarFacturaComponent 
                    @cerrar="dialogCerrarFactura = false"
                    :factura="facturaCerrar"
                />
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
        facturaCerrar: {},
        facturas: [],
        editando: false,
        loading: false,
        search: '',
        dialog: false,
        dialogCerrarFactura: false,
        headers: [
            {
                text: "Fecha",
                value: "created_at",
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
                value: "mensajero.nombre",
                sortable: false,
            },
            {
                text: "Cliente",
                value: "cliente.nombre",
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
        },

        dialogCerrarFactura(valor){
            if(!valor){
                this.facturaCerrar = {};
                this.listarDespachadas()
            }
        }

    },

    mounted(){
        this.listarDespachadas()
    },

    methods: {

        async listarDespachadas(){
            try {
                const {data} = await this.$axios.get('factura/listar-despachadas')
                this.facturas = data
            } catch (error) {
                console.log('Erro al listar')
            }
        },

        editar(item){
            this.dialog = true;
            this.editando = true;
            this.factura = item;
        },

        cerrarFactura(item){
            this.dialogCerrarFactura = true;
            this.facturaCerrar = item
        }

    }
};
</script>
