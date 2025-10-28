<template>
    <v-form ref="form" lazy-validation>
        <v-row>
            <v-col cols="12">
                <v-autocomplete v-model="form.forma_pago_id" :items="formaPagos" :rules="rules.forma_pago_id"
                    item-value="id" item-text="nombre" label="Forma de pago"></v-autocomplete>
            </v-col>
            <v-col cols="12">
                <v-text-field v-model.number="form.valor" :rules="rules.valor" label="Valor" required></v-text-field>
            </v-col>
            <div class="d-flex justify-end p-2">
                <v-btn outlined color="red" @click="$emit('cerrar')" class="mr-2">
                    Cancelar
                </v-btn>
                <v-btn color="primary" @click="submit()">
                    Actualizar
                </v-btn>
            </div>
        </v-row>
    </v-form>
</template>
<script>
export default {
    name: "FormActualizarDetalleComponent",
    props: {
        item: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            formaPagos: [],
            form: {
                forma_pago_id: null,
                valor: null
            },
            rules: {
                forma_pago_id: [v => !!v || 'La forma de pago es requerida'],
                valor: [
                    v => !!v || 'El valor es requerido',
                    v => v > 0 || 'El valor debe ser mayor a 0'
                ]
            }
        }
    },

    mounted() {
        this.getFormasDePago()
        if (this.item) {
            this.form.forma_pago_id = this.item.forma_pago_id
            this.form.valor = this.item.valor
        }
    },

    methods: {
        async getFormasDePago() {
            try {
                const { data } = await this.$axios.get('/forma-pago/listar-activos')
                this.formaPagos = data
            } catch (error) {
                this.$toast.error('Error al listar los mensajeros')
            }
        },

        async submit() {
            const isValid = await this.$refs.form.validate()
            if (!isValid) return
            try {
                await this.$axios.put(`/factura-detalle/actualizar/${this.item.id}`, this.form)
                this.$toast.success('Detalle actualizado correctamente')
                this.$emit('submit')
                this.$emit('cerrar')
            } catch (error) {
                this.$toast.error('Error al actualizar el detalle')
            }
        }
    }
}

</script>