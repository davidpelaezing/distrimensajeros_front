<template>
    <v-row>
        <v-col class="mx-auto" cols="12" sm="12" md="12">
            <v-card :loading="loading" :diasable="loading">
                <v-card-title>
                    <v-toolbar flat>
                        <v-toolbar-title>
                            <div class="d-flex align-center">
                                <span>Factura {{ factura.factura }}</span>
                            </div>
                        </v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                    </v-toolbar>
                </v-card-title>

                <v-card-text>

                    <v-row>
                        <v-col cols="12" md="6">
                            <h4># Factura</h4>
                            <p class="text-h4 font-weight-black">{{ factura.factura }}</p>

                            <h4>Total</h4>
                            <p class="text-h4 font-weight-black">{{ $formatPesos(factura.valor) }}</p>
                        </v-col>
                        <v-col cols="12" md="6">
                            <h4>Mensajero</h4>
                            <p>{{ factura.mensajero.nombre }}</p>

                            <h4>Cliente</h4>
                            <p>{{ factura.cliente.nombre }}</p>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-card-text>
                    <v-data-table :headers="headers" :items="factura.detalles">

                        <template v-slot:item.valor="{ item }">
                            {{ $formatPesos(item.valor) }}
                        </template>

                        <template v-slot:item.created_at="{ item }">
                            {{ $moment(item.created_at).format('DD/MM/YYYY-HH:mm') }}
                        </template>

                    </v-data-table>
                </v-card-text>

            </v-card>
        </v-col>
    </v-row>
</template>
<script>
export default {
    name: "FacturaUniquePage",
    data() {
        return {
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
                { text: 'ID', value: 'id' },
                { text: 'forma de pago', value: 'forma_pago.nombre' },
                { text: 'Mensajero', value: 'mensajero.nombre' },
                { text: 'Observacion', value: 'observacion' },
                { text: 'Operador', value: 'operador.nombre' },
                { text: 'Fecha', value: 'created_at' },
                { text: 'valor', value: 'valor' },
            ],
            loading: false,
        }
    },
    mounted() {
        this.fetchFactura();
    },
    computed: {
        unique() {
            return this.$route.params.unique;
        }
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
    }
}
</script>