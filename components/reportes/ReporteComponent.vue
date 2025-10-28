<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-card-text>
            <v-toolbar flat>
                <v-toolbar-title class="d-flex align-center">
                    Reportes
                </v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
            </v-toolbar>
        </v-card-text>
        <v-alert dense type="info">
            Seleccione minimo la fecha inicio y fin para activar generar el reporte de facturas.
        </v-alert>

        <v-row class="mx-2">
            <v-col cols="12" md="2">
                <v-select v-model="filtro.cliente_id" :items="clientes" item-value="id" item-text="nombre"
                    label="Cliente"></v-select>
            </v-col>

            <v-col cols="12" md="2">
                <v-autocomplete v-model="filtro.mensajero_id" :items="mensajeros" item-value="id" item-text="nombre"
                    label="Mensajeros"></v-autocomplete>
            </v-col>

            <v-col cols="12" md="2">
                <v-text-field v-model="filtro.fecha_inicio" label="Fecha inicio" type="date" />
            </v-col>

            <v-col cols="12" md="2">
                <v-text-field v-model="filtro.fecha_fin" label="Fecha fin" type="date" :min="filtro.fecha_inicio"
                    :error-messages="mensajeErrorFecha" />
            </v-col>

            <v-col cols="12" md="2">
                <v-select v-model="filtro.estado_id" :items="estados" item-value="id" item-text="nombre"
                    label="Estado"></v-select>
            </v-col>

            <v-col cols="12" md="2">
                <v-select v-model="filtro.forma_pago_id" :items="formasPago" item-value="id" item-text="nombre"
                    label="Forma de pago"></v-select>
            </v-col>
        </v-row>

        <v-row align="center" justify="space-around" class="mb-4">
            <v-btn tile color="info" :disabled="botonDeshabilitado" @click="exportar">
                <v-icon left>mdi-file-excel</v-icon>
                Generar Reporte
            </v-btn>
        </v-row>
    </v-card>
</template>

<script>
export default {
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
        /**==============================================
         * ?   Habilita el botón solo si hay fecha inicio y fin
         *=============================================**/
        botonDeshabilitado() {
            return !(this.filtro.fecha_inicio && this.filtro.fecha_fin);
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
