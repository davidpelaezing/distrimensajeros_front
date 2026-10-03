<template>
    <div>
        <PageHeaderComponent title="Facturas" subtitle="Registra, filtra y cierra las facturas despachadas"
            icon="mdi-note-multiple">
            <v-btn color="primary" depressed large class="rounded-lg px-5" @click="nuevo">
                <v-icon left>mdi-plus</v-icon>
                Nueva factura
            </v-btn>
        </PageHeaderComponent>

        <ResumenComponent :items="resumen" :loading="loading && !facturas.length" />

        <!-- Filtros -->
        <v-card flat class="rounded-xl mb-6 fade-up" style="animation-delay: 360ms">
            <div class="d-flex align-center px-5 pt-4" style="cursor: pointer" @click="mostrarFiltros = !mostrarFiltros">
                <v-icon color="primary" class="mr-2">mdi-filter-variant</v-icon>
                <span class="text-subtitle-1 font-weight-bold">Filtros</span>
                <v-chip v-if="filtrosActivos" x-small color="primary" class="ml-2">{{ filtrosActivos }}</v-chip>
                <v-spacer></v-spacer>
                <v-btn icon small>
                    <v-icon>{{ mostrarFiltros ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
            </div>

            <v-expand-transition>
                <div v-show="mostrarFiltros">
                    <v-card-text class="px-5 pt-4 pb-1">
                        <v-row dense>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field v-model="filtro.factura" label="# de factura" outlined dense clearable
                                    prepend-inner-icon="mdi-pound" @keyup.enter="listar()" />
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-autocomplete v-model="filtro.cliente_id" :items="clientes" item-value="id"
                                    item-text="nombre" label="Cliente" outlined dense clearable
                                    prepend-inner-icon="mdi-account-multiple-check-outline"
                                    no-data-text="Sin resultados"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-autocomplete v-model="filtro.mensajero_id" :items="mensajeros" item-value="id"
                                    item-text="nombre" label="Mensajero" outlined dense clearable
                                    prepend-inner-icon="mdi-motorbike" no-data-text="Sin resultados"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-select v-model="filtro.forma_pago_id" :items="formaPagos" item-value="id"
                                    item-text="nombre" label="Forma de pago" outlined dense clearable
                                    prepend-inner-icon="mdi-credit-card-outline"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-select v-model="filtro.estado_id" :items="estados" item-value="id"
                                    item-text="nombre" label="Estado" outlined dense clearable
                                    prepend-inner-icon="mdi-progress-check"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field v-model="filtro.fecha_inicio" label="Fecha inicio" type="date" outlined
                                    dense prepend-inner-icon="mdi-calendar-start" />
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <v-text-field v-model="filtro.fecha_fin" label="Fecha fin" type="date" outlined dense
                                    :min="filtro.fecha_inicio" prepend-inner-icon="mdi-calendar-end" />
                            </v-col>
                            <v-col cols="12" sm="6" md="3" class="d-flex">
                                <v-btn color="primary" depressed class="rounded-lg flex-grow-1 mr-2" height="40"
                                    :loading="loading" @click="listar()">
                                    <v-icon left small>mdi-magnify</v-icon>
                                    Filtrar
                                </v-btn>
                                <v-btn outlined color="grey darken-1" class="rounded-lg" height="40"
                                    @click="limpiarFiltros()">
                                    <v-icon small>mdi-filter-remove-outline</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </div>
            </v-expand-transition>
            <div v-if="!mostrarFiltros" class="pb-3"></div>
        </v-card>

        <!-- Listado -->
        <v-card flat class="rounded-xl overflow-hidden fade-up" style="animation-delay: 440ms">
            <v-card-title class="px-5 py-4">
                <span class="text-subtitle-1 font-weight-bold">Listado de facturas</span>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Buscar en resultados..."
                    outlined dense hide-details clearable class="mt-2 mt-sm-0" style="max-width: 280px"></v-text-field>
            </v-card-title>
            <v-divider></v-divider>

            <v-data-table :headers="headers" :items="facturas" :search="search" :loading="loading"
                loading-text="Cargando facturas..." no-data-text="No hay facturas para los filtros seleccionados"
                no-results-text="No se encontraron coincidencias">

                <template v-slot:[`item.created_at`]="{ item }">
                    <div class="py-2">
                        <div class="font-weight-medium">{{ $moment(item.created_at).format('DD/MM/YYYY') }}</div>
                        <div class="text-caption grey--text">{{ $moment(item.created_at).format('hh:mm a') }}</div>
                    </div>
                </template>

                <template v-slot:[`item.factura`]="{ item }">
                    <nuxt-link :to="`/factura/${item.factura}`" class="font-weight-bold primary--text text-decoration-none">
                        #{{ item.factura }}
                    </nuxt-link>
                </template>

                <template v-slot:[`item.recibo`]="{ item }">
                    <span class="grey--text text--darken-1">{{ item.recibo || '—' }}</span>
                </template>

                <template v-slot:[`item.mensajero.nombre`]="{ item }">
                    <div class="d-flex align-center">
                        <v-icon small color="grey" class="mr-1">mdi-motorbike</v-icon>
                        {{ item.mensajero ? item.mensajero.nombre : '—' }}
                    </div>
                </template>

                <template v-slot:[`item.valor`]="{ item }">
                    <span class="font-weight-bold">{{ $formatPesos(item.valor) }}</span>
                </template>

                <template v-slot:[`item.estado.nombre`]="{ item }">
                    <v-chip small :color="estadoInfo(item.estado_id).bg" :text-color="estadoInfo(item.estado_id).color"
                        class="font-weight-medium">
                        <v-icon x-small left>{{ estadoInfo(item.estado_id).icon }}</v-icon>
                        {{ item.estado ? item.estado.nombre : estadoInfo(item.estado_id).nombre }}
                    </v-chip>
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
                        <v-tooltip v-if="item.estado_id != 3" top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon small color="green darken-1" v-bind="attrs" v-on="on"
                                    @click="cerrarFactura(item)">
                                    <v-icon small>mdi-cash-register</v-icon>
                                </v-btn>
                            </template>
                            <span>Cerrar / registrar pago</span>
                        </v-tooltip>
                        <v-tooltip top>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn icon small color="blue-grey" v-bind="attrs" v-on="on"
                                    :to="`/factura/${item.factura}`">
                                    <v-icon small>mdi-eye-outline</v-icon>
                                </v-btn>
                            </template>
                            <span>Ver detalle</span>
                        </v-tooltip>
                    </div>
                </template>

            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" max-width="600px" content-class="rounded-xl">
            <FormFacturaComponent @cerrar="dialog = false" @submit="listar()" :editando="editando" :factura="factura" />
        </v-dialog>

        <v-dialog v-model="dialogCerrarFactura" max-width="780px" content-class="rounded-xl">
            <FormCerrarFacturaComponent @cerrar="dialogCerrarFactura = false" :factura="facturaCerrar" />
        </v-dialog>

        <AlertComponent ref="alertComponent" />
    </div>
</template>
<script>

import AlertComponent from "@/components/helpers/AlertComponent";
import FormFacturaComponent from "@/components/factura/FormFacturaComponent";
import FormCerrarFacturaComponent from "@/components/factura/FormCerrarFacturaComponent";
import PageHeaderComponent from "@/components/helpers/PageHeaderComponent";
import ResumenComponent from "@/components/helpers/ResumenComponent";
import { mapGetters } from 'vuex'

export default {
    components: {
        AlertComponent,
        FormFacturaComponent,
        FormCerrarFacturaComponent,
        PageHeaderComponent,
        ResumenComponent
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
        mostrarFiltros: true,
        dialog: false,
        dialogCerrarFactura: false,
        total: 0,
        perPage: 10,
        options: {
            page: 1,
            itemsPerPage: 10,
            sortBy: [],
            sortDesc: [],
        },
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
            { text: "Fecha", value: "created_at", sortable: true },
            { text: "Nro factura", value: "factura", sortable: false },
            { text: "Recibo", value: "recibo", sortable: false },
            { text: "Mensajero", value: "mensajero.nombre", sortable: false },
            { text: "Cliente", value: "cliente.nombre", sortable: false },
            { text: "Valor", value: "valor", align: 'end' },
            { text: "Estado", value: "estado.nombre", sortable: false },
            { text: "Acciones", value: "actions", sortable: false, align: 'end', width: 130 }
        ],
    }),

    computed: {
        /**
         * Totales para las tarjetas de resumen (según el listado filtrado)
         */
        resumen() {
            const total = this.facturas.length
            const pendientes = this.facturas.filter(f => f.estado_id == 2).length
            const completas = this.facturas.filter(f => f.estado_id == 3).length
            const valor = this.facturas.reduce((acc, f) => acc + (Number(f.valor) || 0), 0)
            return [
                { label: 'Facturas', value: total, icon: 'mdi-note-multiple-outline', color: 'primary', bg: 'primary lighten-5' },
                { label: 'Pendientes', value: pendientes, icon: 'mdi-clock-outline', color: 'orange darken-2', bg: 'orange lighten-5' },
                { label: 'Completas', value: completas, icon: 'mdi-check-circle-outline', color: 'green darken-2', bg: 'green lighten-5' },
                { label: 'Valor total', value: this.$formatPesos(valor), icon: 'mdi-cash-multiple', color: 'blue darken-2', bg: 'blue lighten-5' },
            ]
        },

        /**
         * Cantidad de filtros con valor
         */
        filtrosActivos() {
            return Object.values(this.filtro).filter(v => v !== null && v !== '' && v !== undefined).length
        },
    },

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
        },
        options: {
            handler(val) {
                this.perPage = val.itemsPerPage
                this.listar()
            },
            deep: true
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

                // const { page, itemsPerPage } = this.options

                const { data } = await this.$axios.get('factura/listar', {
                    params: {
                        ...this.filtro
                        // page,
                        // per_page: itemsPerPage
                    }
                })

                this.facturas = data
                // this.total = data.total
                // this.perPage = data.per_page

            } catch (error) {
                console.error('Error al listar', error)
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

        nuevo() {
            this.editando = false;
            this.factura = {};
            this.dialog = true;
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

        /**
         * color, icono y nombre según el estado
         */
        estadoInfo(id) {
            const estados = {
                1: { nombre: 'Despachado', icon: 'mdi-truck-fast-outline', color: 'blue darken-2', bg: 'blue lighten-5' },
                2: { nombre: 'Pendiente', icon: 'mdi-clock-outline', color: 'orange darken-3', bg: 'orange lighten-5' },
                3: { nombre: 'Completo', icon: 'mdi-check-circle-outline', color: 'green darken-3', bg: 'green lighten-5' },
            }
            return estados[id] || { nombre: 'Sin estado', icon: 'mdi-help-circle-outline', color: 'grey darken-2', bg: 'grey lighten-4' }
        },

        limpiarFiltros() {
            this.filtro.factura = null;
            this.filtro.mensajero_id = null;
            this.filtro.fecha_inicio = null;
            this.filtro.fecha_fin = null;
            this.filtro.estado_id = null;
            this.filtro.cliente_id = null;
            this.filtro.forma_pago_id = null;
            this.listar();
        }

    }
};
</script>
