<template>

    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-card-title class="d-flex align-center">
            {{ editando ? 'Editar' : 'Crear'}} factura
        </v-card-title>
        <v-card-text>

            <v-form v-model="valid" ref="form" lazy-validation>
                <v-row>
                    <v-col cols="12">
                        <v-autocomplete v-model="form.mensajero_id" :rules="rules.mensajero_id" :items="mensajeros" item-value="id" item-text="nombre"
                            label="Mensajeros"></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <v-autocomplete v-model="form.cliente_id" :rules="rules.cliente_id" :items="clientes" item-value="id" item-text="nombre" label="Clientes"></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="form.factura" :rules="rules.factura" ref="factura" label="Factura" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="form.recibo" :rules="rules.recibo" label="Recibo" required></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model.number="form.valor" :rules="rules.valor" label="Valor" @keyup.enter="submit()"
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
                recibo: [v =>!!v || 'Este campo es requerido'],
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
                this.$toast.error('Error al listar los mensajeros')
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