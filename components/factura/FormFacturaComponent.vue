<template>

    <v-card flat class="rounded-xl overflow-hidden">
        <div class="d-flex align-center px-6 pt-6 pb-2">
            <v-avatar size="42" rounded="lg" color="primary lighten-5" class="mr-3">
                <v-icon color="primary">{{ editando ? 'mdi-file-document-edit-outline' : 'mdi-file-document-plus-outline' }}</v-icon>
            </v-avatar>
            <div>
                <div class="text-h6 font-weight-bold">{{ editando ? 'Editar' : 'Nueva' }} factura</div>
                <div class="text-caption grey--text text--darken-1">
                    {{ editando ? 'Actualiza los datos de la factura' : 'Asigna la factura a un mensajero y cliente' }}
                </div>
            </div>
            <v-spacer></v-spacer>
            <v-btn icon @click="$emit('cerrar')">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </div>

        <v-card-text class="px-6 pt-5 pb-2">
            <v-form v-model="valid" ref="form" lazy-validation :disabled="loading">
                <v-row dense>
                    <v-col cols="12" sm="6">
                        <v-autocomplete v-model="form.mensajero_id" :rules="rules.mensajero_id" :items="mensajeros"
                            item-value="id" item-text="nombre" label="Mensajero" outlined
                            prepend-inner-icon="mdi-motorbike" no-data-text="Sin resultados"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-autocomplete v-model="form.cliente_id" :rules="rules.cliente_id" :items="clientes"
                            item-value="id" item-text="nombre" label="Cliente" outlined
                            prepend-inner-icon="mdi-account-multiple-check-outline"
                            no-data-text="Sin resultados"></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="form.factura" :rules="rules.factura" ref="factura" label="Nro factura"
                            outlined prepend-inner-icon="mdi-pound" required></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                        <v-text-field v-model="form.recibo" :rules="rules.recibo" label="Recibo" outlined
                            prepend-inner-icon="mdi-receipt-text-outline" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model.number="form.valor" :rules="rules.valor" label="Valor" outlined
                            prepend-inner-icon="mdi-cash" prefix="$" type="number" min="0"
                            :hint="form.valor ? $formatPesos(form.valor) : ''" persistent-hint
                            @keyup.enter="submit()" required></v-text-field>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>

        <v-divider class="mt-2"></v-divider>

        <v-card-actions class="px-6 py-4">
            <v-spacer></v-spacer>
            <v-btn text class="px-4" @click="$emit('cerrar')">Cancelar</v-btn>
            <v-btn color="primary" depressed class="rounded-lg px-5" :loading="loading" @click="submit(true)">
                <v-icon left small>mdi-content-save-outline</v-icon>
                {{ editando ? 'Actualizar' : 'Crear factura' }}
            </v-btn>
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
            mensajeros: [],
            clientes: [],
            form: {
                mensajero_id: null,
                cliente_id: null,
                factura: null,
                recibo: null,
                valor: null,
            },
            rules: {
                mensajero_id: [v =>!!v || 'Este campos es requerido'],
                cliente_id: [v =>!!v || 'Este campo es requerido'],
                factura: [v =>!!v || 'Este campo es requerido'],
                valor: [v =>!!v || 'Este campo es requerido'],
            }
        }
    },

    mounted(){

        if(this.editando){
            this.asignarData()
        }

        this.getMensajeros();
        this.getClientes();

    },

    watch: {
        editando(valor){
            if(valor){
                this.asignarData()
            }else{
                this.limpiar()
            }
        }
    },

    methods: {

        /**
         * Submitea el formulario
         */
         async submit() {
            try {
                if(!this.$refs.form.validate()){
                    return;
                }
                this.loading = true;
                if(this.editando){
                    await this.$axios.put('factura/actualizar/' + this.factura.id, this.form);
                    this.$toast.success('Factura actualizada con exito.')
                } else {
                    await this.$axios.post('factura/crear', this.form);
                    this.$toast.success('Factura creada con exito.')
                }
                this.$emit('submit')
                this.$emit('cerrar')
                this.limpiar()
            } catch (error) {
                this.$toast.error(error.response.data.error);
                console.log(error.response)
            } finally {
                this.loading = false;
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

        async getClientes(){
            try {
                const { data } = await this.$axios.get('/cliente/listar-activos')
                this.clientes = data
            } catch (error) {
                this.$toast.error('Error al listar los Clientes')
            }
        },

        limpiar() {
            this.form.fecha = '2024-06-08';
            this.form.factura = null;
            this.form.recibo = null;
            this.form.mensajero_id = null;
            this.form.cliente_id = null;
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
