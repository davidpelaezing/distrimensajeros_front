<template>

    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-card-title class="d-flex align-center">
            {{ editando ? 'Editar' : 'Crear'}} factura
        </v-card-title>
        <v-card-text>

            <v-form v-model="valid" ref="form" lazy-validation>
                <v-row>
                    <v-col cols="12">
                        <v-text-field v-model="form.fecha" label="Fecha" type="date" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-autocomplete v-model="form.mensajero_id" :items="mensajeros"
                            label="Mensajeros"></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <v-autocomplete v-model="form.cliente_id" :items="clientes" label="Clientes"></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="form.factura" ref="factura" label="Factura" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="form.recibo" label="Recibo" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model.number="form.valor" label="Valor" @keyup.enter="submit()"
                            required></v-text-field>
                    </v-col>
                </v-row>
            </v-form>

        </v-card-text>

        <v-card-actions>
            <v-btn color="primary" @click="submit()" v-if="!editando">Guardar y crear otro</v-btn>
            <v-btn color="primary" @click="submit(true)">{{ editando ? 'Actualizar' : 'Crear'}}</v-btn>
            <v-btn color="error" @click="$emit('cerrar')">Cancelar</v-btn>
        </v-card-actions>

    </v-card>

</template>
<script>
import { mapMutations } from "vuex";
export default {

    props: {
        editando: Boolean,
        factura: Object
    },

    data() {
        return {
            loading: false,
            valid: false,
            mensajeros: [
                'david',
                'carlos',
                'felipe',
                'maria'
            ],
            clientes: [
                'telas SA',
                'camisetas SA',
                'empanadas SA',
            ],
            form: {
                fecha: '2024-06-08',
                mensajero_id: null,
                factura: null,
                recibo: null,
                cliente_id: null,
                hora_salida: null,
                valor: null,
            }
        }
    },

    mounted(){
        if(this.editando){
            this.asignarData()
        }
    },

    watch: {
        editando(valor){
            if(valor){
                this.asignarData()
            }
        }
    },

    methods: {

        ...mapMutations('factura', ['AGREGAR_FACTURA']),

        async submit(cerrar = false) {
            try {
                const request = {
                    fecha: this.form.fecha,
                    mensajero_id: this.form.mensajero_id,
                    factura: this.form.factura,
                    recibo: this.form.recibo,
                    cliente_id: this.form.cliente_id,
                    hora_salida: this.form.hora_salida,
                    valor: this.form.valor,
                }
                this.AGREGAR_FACTURA(request)
                this.limpiar()

                if (cerrar) {
                    this.$emit('cerrar')
                }
            } catch (error) {
                console.log(error)
            }
        },

        limpiar() {
            this.form.fecha = '2024-06-08';
            this.form.factura = null;
            this.form.recibo = null;
            //this.form.mensajero_id = null;
            //this.form.cliente_id = null;
            this.form.hora_salida = null;
            this.form.valor = null;

            this.$refs.factura.focus()
        },

        asignarData(){
            this.form.fecha = this.factura.fecha;
            this.form.mensajero_id = this.factura.mensajero_id;
            this.form.factura = this.factura.factura;
            this.form.recibo = this.factura.recibo;
            this.form.cliente_id = this.factura.cliente_id;
            this.form.hora_salida = this.factura.hora_salida;
            this.form.valor = this.factura.valor;
        }

    }

}

</script>