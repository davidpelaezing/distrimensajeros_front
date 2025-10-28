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
                            <FormFacturaComponent @cerrar="dialog = false" @submit="listar()" :editando="editando"
                                :factura="factura" />
                        </v-dialog>
                    </v-toolbar>

                    <v-row class="mx-2">

                        <v-col cols="12" md="6">
                            <v-text-field v-model="filtro.factura" label="# de factura" type="text" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-autocomplete v-model="filtro.mensajero_id" :items="mensajeros" item-value="id"
                                item-text="nombre" label="Mensajeros"></v-autocomplete>
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="filtro.fecha_inicio" label="Fecha inicio" type="date" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field v-model="filtro.fecha_fin" label="Fecha fin" type="date" />
                        </v-col>

                        <v-col cols="12">
                            <v-select v-model="filtro.cliente_id" :items="clientes" item-value="id" item-text="nombre"
                                label="Clientes"></v-select>
                        </v-col>

                        <v-col cols="12">
                            <v-select v-model="filtro.forma_pago_id" :items="formaPagos" item-value="id"
                                item-text="nombre" label="Forma de pago"></v-select>
                        </v-col>

                        <v-col cols="12">
                            <v-select v-model="filtro.estado_id" :items="estados" item-value="id" item-text="nombre"
                                label="Estado"></v-select>
                        </v-col>
                    </v-row>

                    <div>
                        <v-col cols="12" md="3" class="d-flex align-center mt-4">
                            <v-btn dark color="green" class="mr-2" @click="listar()">
                                Filtrar
                            </v-btn>
                            <v-btn dark color="red" class="mr-2" @click="limpiarFiltros()">
                                Limpiar
                            </v-btn>
                        </v-col>
                    </div>

                </template>

                <template v-slot:[`item.created_at`]="{ item }">
                    <v-chip>{{ $moment(item.created_at).format('DD/MM/YYYY HH:mm') }}</v-chip>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-chip outlined @click="editar(item)">Editar</v-chip>
                    <v-chip v-if="item.estado_id != 3" color="primary" outlined
                        @click="cerrarFactura(item)">Cerrar</v-chip>
                    <v-chip color="info" outlined :to="`/factura/${item.factura}`">Ver</v-chip>
                </template>

            </v-data-table>

            <v-dialog v-model="dialogCerrarFactura" max-width="700px">
                <FormCerrarFacturaComponent @cerrar="dialogCerrarFactura = false" :factura="facturaCerrar" />
            </v-dialog>


        </v-card-text>

        <AlertComponent ref="alertComponent" />

    </v-card>
</template>
<script>

import AlertComponent from "@/components/helpers/AlertComponent";
import FormFacturaComponent from "@/components/factura/FormFacturaComponent";
import FormCerrarFacturaComponent from "@/components/factura/FormCerrarFacturaComponent";
import { mapGetters } from 'vuex'

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
        mensajeros: [],
        clientes: [],
        formaPagos: [],
        editando: false,
        loading: false,
        search: '',
        dialog: false,
        dialogCerrarFactura: false,
        estados: [
            { id: 1, nombre: 'Despachado' },
            { id: 2, nombre: 'Pendiente' },
            { id: 3, nombre: 'Completo' },
        ],
        filtro: {
            factura: null,
            mensajero_id: null,
            fecha_fin: null,
            fecha_inicio: null,
            cliente_id: null,
            forma_pago_id: null,
            estado_id: null
        },
        headers: [
            {
                text: "Fecha",
                value: "created_at",
                sortable: true,
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
                text: "Estado",
                value: "estado.nombre",
                sortable: false,
            },
            {
                text: "Actions",
                value: "actions",
                sortable: false,
            }
        ],
    }),

    watch: {
        dialog(valor) {
            if (!valor) {
                this.editando = false;
                this.factura = {};
            }
        },

        dialogCerrarFactura(valor) {
            if (!valor) {
                this.facturaCerrar = {};
                this.listar()
            }
        }

    },

    mounted() {
        this.listar()
        this.getMensajeros()
        this.getClientes()
        this.getFormasDePago()
    },

    methods: {

        async listar() {
            try {
                this.loading = true
                const { data } = await this.$axios.get('factura/listar', {
                    params: this.filtro
                })
                this.facturas = data
            } catch (error) {
                console.log('Erro al listar')
            } finally {
                this.loading = false
            }
        },

        async getMensajeros() {
            try {
                const { data } = await this.$axios.get('/mensajero/listar-activos')
                this.mensajeros = data
            } catch (error) {
                this.$toast.error('Error al listar los mensajeros')
            }
        },

        async getClientes() {
            try {
                const { data } = await this.$axios.get('/cliente/listar')
                this.clientes = data
            } catch (error) {
                this.$toast.error('Error al listar los clientes')
            }
        },

        async getFormasDePago() {
            try {
                const { data } = await this.$axios.get('/forma-pago/listar-activos')
                this.formaPagos = data
            } catch (error) {
                this.$toast.error('Error al listar las formas de pago')
            }
        },

        editar(item) {
            this.dialog = true;
            this.editando = true;
            this.factura = item;
        },

        cerrarFactura(item) {
            this.dialogCerrarFactura = true;
            this.facturaCerrar = item
        },

        limpiarFiltros() {
            this.filtro.factura = null;
            this.filtro.mensajero_id = null;
            this.filtro.fecha_inicio = null;
            this.filtro.fecha_fin = null;
            this.filtro.estado_id = null;
            this.listar();
        }

    }
};
</script>
