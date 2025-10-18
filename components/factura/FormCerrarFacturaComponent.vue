<template>

    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-card-title class="d-flex align-center">
            Cerrar factura {{ factura?.factura }}
        </v-card-title>

        <v-card-text>
            <v-row>
                <v-col cols="12" md="6">
                    <p class="mb-0"><strong>Numero de factura</strong></p>
                    <p class="mb-0">{{ factura?.factura }}</p>
                </v-col>
                <v-col cols="12" md="6">
                    <p class="mb-0"><strong>Recibo</strong></p>
                    <p class="mb-0">{{ factura?.recibo }}</p>
                </v-col>
                <v-col cols="12" md="6">
                    <p class="mb-0"><strong>Cliente</strong></p>
                    <p class="mb-0">{{ factura?.cliente?.nombre }}</p>
                </v-col>
                <v-col cols="12" md="6">
                    <p class="mb-0"><strong>Fecha</strong></p>
                    <p class="mb-0">{{ factura?.cliente?.created_at }}</p>
                </v-col>
                <v-col cols="12" md="6">
                    <p class="mb-0">Total de la factura</p>
                    <h1 class="mb-0"><strong>{{ factura?.valor }}</strong></h1>
                </v-col>
            </v-row>
        </v-card-text>

        <v-card-text>

            <v-form v-model="valid" ref="form" lazy-validation @submit.prevent="submit()">
                <v-row>
                    <v-col cols="12">
                        <v-autocomplete v-model="form.mensajero_id" :items="mensajeros" :rules="rules.mensajero_id" item-value="id" item-text="nombre"
                            label="Mensajero"></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <v-autocomplete v-model="form.forma_pago_id" :items="formasDePago" :rules="rules.forma_pago_id" item-value="id" item-text="nombre"
                            label="Forma de pago"></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model.number="form.valor" :rules="rules.valor_id" label="Valor" required></v-text-field>
                    </v-col>
                </v-row>
            </v-form>

        </v-card-text>

        <v-card-actions>
            <v-btn color="primary" @click="submit()">Agregar pago</v-btn>
            <v-btn color="error" @click="$emit('cerrar')">Cancelar</v-btn>
        </v-card-actions>

        <v-divider class="my-7"></v-divider>

        <v-card-text>
            <v-data-table :headers="headers" :items="pagos" :items-per-page="10">
                <template v-slot:footer>
                    <h3>Total: 0</h3>
                </template>
            </v-data-table>
        </v-card-text>

    </v-card>

</template>
<script>

export default {

    props: {
        factura: {
            type: Object
        }
    },

    data() {
        return {
            loading: false,
            valid: false,
            headers: [
                { text: 'Forma de pago', value: 'forma_pago_id' },
                { text: 'Mensajero', value: 'mensajero_id' },
                { text: 'Valor', value: 'valor' },
                { text: 'Acciones', value: 'actions' }
            ],
            pagos: [],
            mensajeros: [],
            formasDePago: [],
            form: {
                mensajero_id: null,
                forma_pago_id: null,
                valor: null
            },
            rules: {
                mensajero_id: [v =>!!v || 'Este campos es requerido'],
                forma_pago_id: [v =>!!v || 'Este campo es requerido'],
                valor: [v =>!!v || 'Este campo es requerido'],
            }
        }
    },

    watch: {
        factura(val){
            if(val != null){
                this.asignarData()
                this.listarPagos()
            }
        }
    },

    mounted(){
        this.getMensajeros()
        this.getFormasDePago()
        this.listarPagos()
        this.asignarData()
    },

    methods: {

        async listarPagos(){
            try {
                this.loading = true;
                const {data} = await this.$axios.get('factura-detalle/listar-por-factura/' + this.factura.id)
                this.pagos = data
            } catch (error) {
                console.log(error.response)
            } finally {
                this.loading = false
            }
        },

        async getMensajeros(){
            try {
                const { data } = await this.$axios.get('/mensajero/listar-activos')
                this.mensajeros = data
            } catch (error) {
                this.$toast.error('Error al listar los mensajeros')
            }
        },

        async getFormasDePago(){
            try {
                const { data } = await this.$axios.get('/forma-pago/listar-activos')
                this.formasDePago = data
            } catch (error) {
                this.$toast.error('Error al listar los mensajeros')
            }
        },

        /**
         * Submitea el formulario
         */
        async submit() {
            try {
                if (!this.$refs.form.validate()) {
                    return;
                }

                const request = {
                    ...this.form,
                    factura_id: this.factura.id
                }

                this.loading = true;

                const response = await this.$axios.post('factura-detalle/crear', request);
                this.$toast.success('Detalle creada con exito.')

                this.limpiar()
            } catch (error) {
                this.$toast.error(error.response.data.error);
                console.log(error.response)
            } finally {
                this.loading = false;
            }
        },

        asignarData(){
            this.form.mensajero_id = this.factura.mensajero_id
        },

        limpiar() {
            this.form = {
                forma_pago_id: 'efectivo',
                valor: null
            }
        },

    }

}

</script>