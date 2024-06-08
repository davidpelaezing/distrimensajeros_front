<template>

    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-card-title class="d-flex align-center">
            Cerrar factura
        </v-card-title>
        <v-card-text>

            <v-form v-model="valid" ref="form" lazy-validation>
                <v-row>
                    <v-col cols="12">
                        <v-autocomplete v-model="form.forma_pago_id" :items="formas_pago"
                            label="Forma de pago"></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <v-autocomplete v-model="form.mensajero_id" :items="mensajeros"
                            label="Mensajeros"></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model.number="form.valor" label="Valor" @keyup.enter="submit()"
                            required></v-text-field>
                    </v-col>
                </v-row>
            </v-form>

        </v-card-text>

        <v-card-actions>
            <v-btn color="primary" @click="submit(true)">Agregar pago</v-btn>
            <v-btn color="error" @click="$emit('cerrar')">Cancelar</v-btn>
        </v-card-actions>

        <v-divider class="my-7"></v-divider>

        <v-card-text>
            <v-data-table :headers="headers" :items="pagos" :items-per-page="10">
                <template v-slot:footer>
                    <h3>Total: {{ totalPagos('valor') }}</h3>
                </template>
            </v-data-table>
        </v-card-text>

    </v-card>

</template>
<script>

export default {
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
            pagos:[],
            mensajeros: [
                'david',
                'carlos',
                'felipe',
                'maria'
            ],
            formas_pago: [
                'transferencia',
                'efectivo',
                'firma',
            ],
            form: {
                forma_pago_id: null,
                valor: null
            }
        }
    },

    methods: {

        submit() {
            const request = {
                forma_pago_id: this.form.forma_pago_id,
                mensajero_id: this.form.mensajero_id,
                valor: this.form.valor
            }
            this.limpiar()
            this.pagos.push(request)
        },

        limpiar(){
            this.form = {
                forma_pago_id: 'efectivo',
                valor: null
            }
        },

        totalPagos(column) {
            return this.pagos.reduce((sum, item) => {
                return sum + item[column];
            }, 0);
        },

    }

}

</script>