<template>
    <v-form ref="form" lazy-validation :disabled="loading" @submit.prevent="submit()">
        <v-card-text class="px-6 pt-5 pb-2">
            <v-autocomplete v-model="form.forma_pago_id" :items="formaPagos" :rules="rules.forma_pago_id"
                item-value="id" item-text="nombre" label="Forma de pago" outlined
                prepend-inner-icon="mdi-credit-card-outline" no-data-text="Sin resultados"></v-autocomplete>
            <v-text-field v-model.number="form.valor" :rules="rules.valor" label="Valor" outlined
                prepend-inner-icon="mdi-cash" prefix="$" type="number" min="0"
                :hint="form.valor ? $formatPesos(form.valor) : ''" persistent-hint required></v-text-field>
        </v-card-text>

        <v-divider class="mt-4"></v-divider>

        <v-card-actions class="px-6 py-4">
            <v-spacer></v-spacer>
            <v-btn text class="px-4" @click="$emit('cerrar')">Cancelar</v-btn>
            <v-btn type="submit" color="primary" depressed class="rounded-lg px-5" :loading="loading">
                <v-icon left small>mdi-content-save-outline</v-icon>
                Actualizar
            </v-btn>
        </v-card-actions>
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
            loading: false,
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

    watch: {
        // el diálogo reutiliza el componente, así que refrescamos al cambiar de detalle
        item() {
            this.asignarData()
        }
    },

    mounted() {
        this.getFormasDePago()
        this.asignarData()
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
                this.loading = true
                await this.$axios.put(`/factura-detalle/actualizar/${this.item.id}`, this.form)
                this.$toast.success('Detalle actualizado correctamente')
                this.$emit('submit')
                this.$emit('cerrar')
            } catch (error) {
                this.$toast.error('Error al actualizar el detalle')
            } finally {
                this.loading = false
            }
        },

        asignarData() {
            if (this.item) {
                this.form.forma_pago_id = this.item.forma_pago_id
                this.form.valor = this.item.valor
                this.$nextTick(() => this.$refs.form && this.$refs.form.resetValidation())
            }
        }
    }
}

</script>