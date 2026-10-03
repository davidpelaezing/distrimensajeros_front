<template>
    <div>
        <v-btn text small color="grey darken-1" class="mb-3 px-1 fade-up" to="/" exact>
            <v-icon left small>mdi-arrow-left</v-icon>
            Volver a facturas
        </v-btn>

        <PageHeaderComponent :title="`Factura #${factura.factura}`" :subtitle="subtitulo" icon="mdi-receipt-text-outline">
            <v-chip :color="estado.bg" :text-color="estado.color" class="font-weight-bold">
                <v-icon small left>{{ estado.icon }}</v-icon>
                {{ factura.estado && factura.estado.nombre ? factura.estado.nombre : estado.nombre }}
            </v-chip>
        </PageHeaderComponent>

        <v-row>
            <!-- Información general -->
            <v-col cols="12" lg="8">
                <v-card flat class="rounded-xl pa-6 fill-height fade-up" style="animation-delay: 100ms">
                    <div class="d-flex align-center mb-5">
                        <v-icon color="primary" class="mr-2">mdi-information-outline</v-icon>
                        <span class="text-subtitle-1 font-weight-bold">Información de la factura</span>
                    </div>
                    <v-skeleton-loader v-if="loading && !factura.id" type="list-item-two-line@2"></v-skeleton-loader>
                    <v-row v-else dense>
                        <v-col v-for="dato in datos" :key="dato.label" cols="12" sm="6">
                            <div class="d-flex align-center pa-3 rounded-lg grey lighten-5">
                                <v-avatar size="40" rounded="lg" color="primary lighten-5" class="mr-3">
                                    <v-icon color="primary" small>{{ dato.icon }}</v-icon>
                                </v-avatar>
                                <div class="text-truncate">
                                    <div class="text-caption grey--text text--darken-1">{{ dato.label }}</div>
                                    <div class="font-weight-bold text-truncate">{{ dato.valor || '—' }}</div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

            <!-- Totales -->
            <v-col cols="12" lg="4">
                <v-card flat color="primary" dark class="rounded-xl pa-6 fill-height fade-up"
                    style="animation-delay: 180ms">
                    <div class="d-flex align-center mb-2">
                        <v-avatar size="40" rounded="lg" color="secondary" class="mr-3">
                            <v-icon color="primary">mdi-cash-multiple</v-icon>
                        </v-avatar>
                        <span class="text-subtitle-2" style="opacity: .8">Total de la factura</span>
                    </div>
                    <div class="text-h4 font-weight-bold mb-5">{{ $formatPesos(factura.valor) }}</div>

                    <div class="d-flex justify-space-between text-body-2 mb-1">
                        <span style="opacity: .75">Pagado</span>
                        <span class="font-weight-bold secondary--text">{{ $formatPesos(totalPagado) }}</span>
                    </div>
                    <div class="d-flex justify-space-between text-body-2 mb-3">
                        <span style="opacity: .75">Pendiente</span>
                        <span class="font-weight-bold">{{ $formatPesos(saldoPendiente) }}</span>
                    </div>
                    <v-progress-linear :value="porcentajePagado" color="secondary" background-color="white"
                        background-opacity="0.15" height="8" rounded></v-progress-linear>
                    <div class="text-caption mt-2" style="opacity: .7">{{ Math.round(porcentajePagado) }}% pagado
                        · {{ cantidadPagos }} {{ cantidadPagos === 1 ? 'pago' : 'pagos' }}</div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Detalles / pagos -->
        <v-card flat class="rounded-xl overflow-hidden mt-6 fade-up" style="animation-delay: 260ms">
            <v-card-title class="px-5 py-4">
                <v-icon color="primary" class="mr-2">mdi-format-list-bulleted</v-icon>
                <span class="text-subtitle-1 font-weight-bold">Pagos registrados</span>
            </v-card-title>
            <v-divider></v-divider>

            <v-data-table :headers="headers" :items="factura.detalles || []" :loading="loading"
                loading-text="Cargando pagos..." no-data-text="Esta factura aún no tiene pagos registrados">

                <template v-slot:[`item.id`]="{ item }">
                    <span class="grey--text text--darken-1">#{{ item.id }}</span>
                </template>

                <template v-slot:[`item.forma_pago.nombre`]="{ item }">
                    <v-chip small label color="blue-grey lighten-5" text-color="blue-grey darken-2">
                        {{ item.forma_pago ? item.forma_pago.nombre : '—' }}
                    </v-chip>
                </template>

                <template v-slot:[`item.observacion`]="{ item }">
                    <span class="grey--text text--darken-2">{{ item.observacion || '—' }}</span>
                </template>

                <template v-slot:[`item.valor`]="{ item }">
                    <span class="font-weight-bold">{{ $formatPesos(item.valor) }}</span>
                </template>

                <template v-slot:[`item.created_at`]="{ item }">
                    <div class="py-2">
                        <div>{{ $moment(item.created_at).format('DD/MM/YYYY') }}</div>
                        <div class="text-caption grey--text">{{ $moment(item.created_at).format('hh:mm a') }}</div>
                    </div>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon small color="primary" v-bind="attrs" v-on="on" @click="editar(item)">
                                <v-icon small>mdi-pencil-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>Editar pago</span>
                    </v-tooltip>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialogs.editar" max-width="480px" content-class="rounded-xl">
            <v-card flat class="rounded-xl overflow-hidden">
                <div class="d-flex align-center px-6 pt-6 pb-2">
                    <v-avatar size="42" rounded="lg" color="primary lighten-5" class="mr-3">
                        <v-icon color="primary">mdi-pencil-outline</v-icon>
                    </v-avatar>
                    <div>
                        <div class="text-h6 font-weight-bold">Editar pago</div>
                        <div class="text-caption grey--text text--darken-1">Detalle #{{ item ? item.id : '' }}</div>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="limpiar()">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </div>
                <form-actualizar-detalle-component @cerrar="limpiar()" @submit="fetchFactura()" :item="item" />
            </v-card>
        </v-dialog>

    </div>
</template>
<script>
import FormActualizarDetalleComponent from '@/components/factura/FormActualizarDetalleComponent.vue';
import PageHeaderComponent from '@/components/helpers/PageHeaderComponent';
export default {
    name: "FacturaUniquePage",
    components: {
        FormActualizarDetalleComponent,
        PageHeaderComponent
    },
    data() {
        return {
            dialogs: {
                editar: false
            },
            factura: {
                id: null,
                factura: 'esperando...',
                valor: 0,
                created_at: null,
                estado: null,
                mensajero: {
                    nombre: null
                },
                cliente: {
                    nombre: null
                },
                detalles: []
            },
            headers: [
                { text: 'ID', value: 'id', width: 80 },
                { text: 'Forma de pago', value: 'forma_pago.nombre' },
                { text: 'Mensajero', value: 'mensajero.nombre' },
                { text: 'Observación', value: 'observacion' },
                { text: 'Operador', value: 'operador.nombre' },
                { text: 'Fecha', value: 'created_at' },
                { text: 'Valor', value: 'valor', align: 'end' },
                { text: 'Acciones', value: 'actions', sortable: false, align: 'end', width: 90 }
            ],
            item: null,
            loading: false,
        }
    },
    mounted() {
        this.fetchFactura();
    },
    computed: {
        unique() {
            return this.$route.params.unique;
        },
        cantidadPagos() {
            return (this.factura.detalles || []).length;
        },
        totalPagado() {
            return (this.factura.detalles || []).reduce((acc, d) => acc + (Number(d.valor) || 0), 0);
        },
        saldoPendiente() {
            return Math.max((Number(this.factura.valor) || 0) - this.totalPagado, 0);
        },
        porcentajePagado() {
            const total = Number(this.factura.valor) || 0;
            return total ? Math.min((this.totalPagado / total) * 100, 100) : 0;
        },
        subtitulo() {
            return this.factura.created_at
                ? 'Registrada el ' + this.$moment(this.factura.created_at).format('D [de] MMMM [de] YYYY, hh:mm a')
                : 'Detalle de la factura y sus pagos';
        },
        datos() {
            const f = this.factura;
            return [
                { label: 'Cliente', valor: f.cliente && f.cliente.nombre, icon: 'mdi-account-multiple-check-outline' },
                { label: 'Mensajero', valor: f.mensajero && f.mensajero.nombre, icon: 'mdi-motorbike' },
                { label: 'Nro factura', valor: f.factura, icon: 'mdi-pound' },
                { label: 'Recibo', valor: f.recibo, icon: 'mdi-receipt-text-outline' },
            ];
        },
        estado() {
            const estados = {
                1: { nombre: 'Despachado', icon: 'mdi-truck-fast-outline', color: 'blue darken-2', bg: 'blue lighten-5' },
                2: { nombre: 'Pendiente', icon: 'mdi-clock-outline', color: 'orange darken-3', bg: 'orange lighten-5' },
                3: { nombre: 'Completo', icon: 'mdi-check-circle-outline', color: 'green darken-3', bg: 'green lighten-5' },
            };
            return estados[this.factura.estado_id] || { nombre: 'Cargando...', icon: 'mdi-dots-horizontal', color: 'grey darken-2', bg: 'grey lighten-4' };
        },
    },
    head() {
        return { title: 'Factura ' + this.unique };
    },
    methods: {
        async fetchFactura() {
            try {
                this.loading = true;
                const response = await this.$axios.get(`/factura/consultar/${this.unique}`);
                this.factura = response.data;
            } catch (error) {
                this.$router.push('/')
            } finally {
                this.loading = false;
            }
        },

        limpiar(){
            this.item = null
            this.dialogs.editar = false
        },

        editar(item){
            this.item = item
            this.dialogs.editar = true
        }
    }
}
</script>