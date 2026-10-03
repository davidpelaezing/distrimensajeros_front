<template>
    <div>
        <PageHeaderComponent title="Reportes" subtitle="Exporta el detalle de facturas a Excel según los filtros"
            icon="mdi-file-chart" />

        <v-row>
            <v-col cols="12" lg="8">
                <v-card flat class="rounded-xl overflow-hidden fade-up" style="animation-delay: 100ms">
                    <v-progress-linear v-if="loading" indeterminate color="secondary" height="3"></v-progress-linear>

                    <div class="d-flex align-center px-6 pt-6">
                        <v-icon color="primary" class="mr-2">mdi-filter-variant</v-icon>
                        <span class="text-subtitle-1 font-weight-bold">Filtros del reporte</span>
                        <v-spacer></v-spacer>
                        <v-chip small :color="filtrosActivos ? 'primary lighten-5' : 'grey lighten-4'"
                            :text-color="filtrosActivos ? 'primary' : 'grey darken-1'">
                            {{ filtrosActivos }} {{ filtrosActivos === 1 ? 'filtro activo' : 'filtros activos' }}
                        </v-chip>
                    </div>

                    <v-card-text class="px-6 pt-5">
                        <div class="text-overline grey--text text--darken-1 mb-2">Rango de fechas (obligatorio)</div>
                        <v-row dense>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="filtro.fecha_inicio" label="Fecha inicio" type="date" outlined
                                    dense prepend-inner-icon="mdi-calendar-start" :disabled="loading" />
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-text-field v-model="filtro.fecha_fin" label="Fecha fin" type="date" outlined dense
                                    prepend-inner-icon="mdi-calendar-end" :min="filtro.fecha_inicio"
                                    :error-messages="mensajeErrorFecha" :disabled="loading" />
                            </v-col>
                        </v-row>

                        <div class="text-overline grey--text text--darken-1 mt-2 mb-2">Filtros opcionales</div>
                        <v-row dense>
                            <v-col cols="12" sm="6">
                                <v-autocomplete v-model="filtro.cliente_id" :items="clientes" item-value="id"
                                    item-text="nombre" label="Cliente" outlined dense clearable
                                    prepend-inner-icon="mdi-account-multiple-check-outline"
                                    no-data-text="Sin resultados"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-autocomplete v-model="filtro.mensajero_id" :items="mensajeros" item-value="id"
                                    item-text="nombre" label="Mensajero" outlined dense clearable
                                    prepend-inner-icon="mdi-motorbike" no-data-text="Sin resultados"></v-autocomplete>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-select v-model="filtro.estado_id" :items="estados" item-value="id" item-text="nombre"
                                    label="Estado" outlined dense clearable
                                    prepend-inner-icon="mdi-progress-check"></v-select>
                            </v-col>
                            <v-col cols="12" sm="6">
                                <v-select v-model="filtro.forma_pago_id" :items="formasPago" item-value="id"
                                    item-text="nombre" label="Forma de pago" outlined dense clearable
                                    prepend-inner-icon="mdi-credit-card-outline"></v-select>
                            </v-col>
                        </v-row>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions class="px-6 py-4 flex-wrap">
                        <v-btn text class="px-3" :disabled="loading || !filtrosActivos" @click="limpiarDatos">
                            <v-icon left small>mdi-filter-remove-outline</v-icon>
                            Limpiar filtros
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn color="secondary" depressed large class="rounded-lg px-6" :disabled="botonDeshabilitado"
                            :loading="loading" @click="exportar">
                            <v-icon left>mdi-microsoft-excel</v-icon>
                            Generar reporte
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>

            <v-col cols="12" lg="4">
                <v-card flat color="primary" dark class="rounded-xl pa-6 fade-up" style="animation-delay: 200ms">
                    <v-avatar size="48" rounded="lg" color="secondary" class="mb-4">
                        <v-icon>mdi-file-excel-outline</v-icon>
                    </v-avatar>
                    <div class="text-h6 font-weight-bold mb-1">¿Cómo funciona?</div>
                    <div class="text-body-2" style="opacity: .8">
                        Selecciona como mínimo la fecha de inicio y fin para habilitar la generación del reporte.
                    </div>

                    <v-list dense color="transparent" class="mt-4 pa-0">
                        <v-list-item v-for="(paso, i) in pasos" :key="i" class="px-0">
                            <v-list-item-icon class="mr-3">
                                <v-icon small :color="paso.ok ? 'secondary' : 'white'">
                                    {{ paso.ok ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                                </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title class="text-body-2">{{ paso.texto }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import PageHeaderComponent from '@/components/helpers/PageHeaderComponent'

export default {
    components: {
        PageHeaderComponent
    },
    data: () => ({
        loading: false,
        filtro: {
            factura: '',
            cliente_id: null,
            mensajero_id: null,
            fecha_inicio: '',
            fecha_fin: '',
            estado_id: null,
            forma_pago_id: null,
        },
        clientes: [],
        mensajeros: [],
        estados: [
            { id: 1, nombre: 'Despachado' },
            { id: 2, nombre: 'Pendiente' },
            { id: 3, nombre: 'Completo' },
        ],
        formasPago: [],
    }),

    computed: {
        /**
         * Cantidad de filtros con valor
         */
        filtrosActivos() {
            return Object.values(this.filtro).filter(v => v !== null && v !== '' && v !== undefined).length;
        },
        /**
         * Pasos guía del panel lateral
         */
        pasos() {
            return [
                { texto: 'Elige la fecha de inicio', ok: !!this.filtro.fecha_inicio },
                { texto: 'Elige la fecha de fin', ok: !!this.filtro.fecha_fin && !this.mensajeErrorFecha },
                { texto: 'Agrega filtros opcionales', ok: this.filtrosActivos > 2 },
                { texto: 'Genera y descarga el Excel', ok: false },
            ];
        },
        /**==============================================
         * ?   Habilita el botón solo si hay fecha inicio y fin
         *=============================================**/
        botonDeshabilitado() {
            return !(this.filtro.fecha_inicio && this.filtro.fecha_fin) || !!this.mensajeErrorFecha;
        },
        /**==============================================
         * ?   Mensaje de error para validación de fechas
         *=============================================**/
        mensajeErrorFecha() {
            if (this.filtro.fecha_inicio && this.filtro.fecha_fin) {
                return this.filtro.fecha_fin < this.filtro.fecha_inicio
                    ? 'La fecha final no puede ser menor que la fecha inicial'
                    : '';
            }
            return '';
        },
    },

    created() {
        this.getMensajeros();
        this.listarClientes();
        this.listarFormasPago();
    },

    methods: {
        /**==============================================
         * ?           Exportar reporte de facturas
         * @author      : Calvarez
         * @createdOn   : 2023-03-15
         * @description : Generación de reportes de facturas por filtros
         *=============================================**/
        async exportar() {
            try {
                this.loading = true;
                const response = await this.$axios.post('factura/exportar', this.filtro, {
                    responseType: 'blob',
                });

                const blob = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'detalle_facturas.xlsx');
                document.body.appendChild(link);
                link.click();
                window.URL.revokeObjectURL(url);
                this.limpiarDatos();
            } catch (error) {
                // console.error('Error al exportar las facturas:', error);
                this.$toast?.error('No se encontraron resultados con los filtros seleccionados.');
            } finally {
                this.loading = false;
            }
        },

        /**==============================================
         * ?            Lista los mensajeros activos
         * @author      : Calvarez
         * @createdOn   : 2023-03-15
         * @description : Lista los mensajeros activos
         *=============================================**/
        async getMensajeros() {
            try {
                const { data } = await this.$axios.get('/mensajero/listar-activos');
                this.mensajeros = data;
            } catch {
                this.$toast.error('Error al listar los mensajeros');
            }
        },

        /**==============================================
         * ?            Lista los clientes
         * @author      : Calvarez
         * @createdOn   : 2023-03-15
         * @description : Lista los clientes
         *=============================================**/
        async listarClientes() {
            try {
                this.loading = true;
                const { data } = await this.$axios.get('cliente/listar');
                this.clientes = data;
            } catch (error) {
                console.log(error.response);
            } finally {
                this.loading = false;
            }
        },

        /**==============================================
         * ?        Lista las formas de pago
         * @author      : Calvarez
         * @createdOn   : 2024-06-10
         * @description : Lista las formas de pago
         *=============================================**/
        async listarFormasPago() {
            try {
                this.loading = true;
                const { data } = await this.$axios.get('forma-pago/listar');
                this.formasPago = data;
            } catch (error) {
                console.log(error.response);
            } finally {
                this.loading = false;
            }
        },

        /**==============================================
         * ?         Limpia los datos del filtro
         * @author      : Calvarez
         * @createdOn   : 27 de Octubre de 2025
         * @description : Limpia los datos del filtro
         *=============================================**/
        async limpiarDatos() {
            this.filtro = {
                factura: '',
                cliente_id: null,
                mensajero_id: null,
                fecha_inicio: '',
                fecha_fin: '',
                estado_id: null,
                forma_pago_id: null,
            };
        },
    },
};
</script>
