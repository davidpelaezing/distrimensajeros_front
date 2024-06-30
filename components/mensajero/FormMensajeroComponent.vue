<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-card-title class="d-flex align-center">
            {{ editando ? 'Editar' : 'Crear' }} mensajero
        </v-card-title>
        <v-card-text>

            <v-form v-model="valid" ref="form" lazy-validation @submit.prevent="submit">
                <v-text-field label="nombre" v-model="form.nombre" :rules="rules.nombre"></v-text-field>
            </v-form>

        </v-card-text>

        <v-card-actions>
            <v-btn color="primary" @click="submit">{{ editando ? 'Editar' : 'Crear' }}</v-btn>
            <v-btn color="error" @click="$emit('cerrar')">Cancelar</v-btn>
        </v-card-actions>

    </v-card>
</template>
<script>

export default {

    props:{
        editando: {
            type: Boolean,
            default: false
        },
        mensajero: {
            type: Object,
            default: null
        }
    },

    data() {
        return {
            loading: false,
            valid: false,
            form:{
                nombre: null
            },
            rules: {
                nombre: [v =>!!v || 'El nombre es requerido']
            }
        }
    },

    watch: {
        editando(val){
            if(val){
                this.asignarData();
            } else {
                this.limpiar();
            }
        }
    },

    mounted(){
        if(this.editando){
            this.asignarData();
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
                    await this.$axios.put('mensajero/actualizar/' + this.mensajero.id, this.form);
                    this.$toast.success('Mensajero actualizado con exito.')
                } else {
                    await this.$axios.post('mensajero/crear', this.form);
                    this.$toast.success('Mensajero creado con exito.')
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

        asignarData(){
            this.form.nombre = this.mensajero.nombre
        },

        limpiar() {
            this.form.nombre = null
            this.$refs.form.resetValidation()
        },

    }
}

</script>
