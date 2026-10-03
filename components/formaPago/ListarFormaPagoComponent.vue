<template>
    <div>
        <PageHeaderComponent title="Formas de pago" subtitle="Configura los medios de pago disponibles en las facturas" icon="mdi-credit-card-multiple-outline">
            <v-btn color="primary" depressed large class="rounded-lg px-5" @click="nuevo">
                <v-icon left>mdi-plus</v-icon>
                Nueva forma de pago
            </v-btn>
        </PageHeaderComponent>

        <ResumenComponent :items="resumen" :loading="loading && !formaPagos.length" />

        <v-card flat class="rounded-xl overflow-hidden fade-up" style="animation-delay: 320ms">
            <v-card-title class="px-5 py-4">
                <span class="text-subtitle-1 font-weight-bold">Listado de formas de pago</span>
                <v-spacer></v-spacer>
                <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Buscar..." outlined dense
                    hide-details clearable class="mt-2 mt-sm-0" style="max-width: 280px"></v-text-field>
            </v-card-title>
            <v-divider></v-divider>

            <v-data-table :headers="headers" :items="formaPagos" :search="search" :loading="loading"
                loading-text="Cargando formas de pago..." no-data-text="Aún no hay formas de pago registradas"
                no-results-text="No se encontraron coincidencias">

                <template v-slot:[`item.id`]="{ item }">
                    <span class="grey--text text--darken-1">#{{ item.id }}</span>
                </template>

                <template v-slot:[`item.nombre`]="{ item }">
                    <div class="d-flex align-center py-2">
                        <v-avatar size="34" color="primary lighten-5" class="mr-3">
                            <span class="primary--text text-caption font-weight-bold">{{ iniciales(item.nombre) }}</span>
                        </v-avatar>
                        <span class="font-weight-medium">{{ item.nombre }}</span>
                    </div>
                </template>

                <template v-slot:[`item.activo`]="{ item }">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-chip small v-bind="attrs" v-on="on" @click="cambiarEstado(item)"
                                :color="item.activo ? 'green lighten-5' : 'red lighten-5'"
                                :text-color="item.activo ? 'green darken-3' : 'red darken-3'" class="font-weight-medium">
                                <v-icon x-small left>mdi-circle</v-icon>
                                {{ item.activo ? 'Activo' : 'Inactivo' }}
                            </v-chip>
                        </template>
                        <span>Clic para {{ item.activo ? 'desactivar' : 'activar' }}</span>
                    </v-tooltip>
                </template>

                <template v-slot:[`item.actions`]="{ item }">
                    <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn icon small color="primary" v-bind="attrs" v-on="on" @click="editar(item)">
                                <v-icon small>mdi-pencil-outline</v-icon>
                            </v-btn>
                        </template>
                        <span>Editar</span>
                    </v-tooltip>
                </template>
            </v-data-table>
        </v-card>

        <v-dialog v-model="dialog" max-width="480px" content-class="rounded-xl">
            <FormFormaPagoComponent @submit="listar()" @cerrar="dialog = false" :editando="editando" :formaPago="formaPago" />
        </v-dialog>

        <AlertComponent ref="alertComponent" />
    </div>
</template>
<script>
import AlertComponent from '@/components/helpers/AlertComponent'
import PageHeaderComponent from '@/components/helpers/PageHeaderComponent'
import ResumenComponent from '@/components/helpers/ResumenComponent'
import FormFormaPagoComponent from '@/components/formaPago/FormFormaPagoComponent'

export default {
    components: {
        AlertComponent,
        PageHeaderComponent,
        ResumenComponent,
        FormFormaPagoComponent
    },
    data: () => ({
        loading: false,
        search: '',
        formaPagos: [],
        formaPago: null,
        editando: false,
        dialog: false,
        headers: [
            { text: 'ID', value: 'id', width: 90 },
            { text: 'Nombre', value: 'nombre' },
            { text: 'Estado', value: 'activo', width: 150 },
            { text: 'Acciones', value: 'actions', sortable: false, align: 'end', width: 110 },
        ],
    }),

    computed: {
        /**
         * Totales para las tarjetas de resumen
         */
        resumen() {
            const total = this.formaPagos.length
            const activos = this.formaPagos.filter(i => i.activo).length
            return [
                { label: 'Total', value: total, icon: 'mdi-format-list-bulleted', color: 'primary', bg: 'primary lighten-5' },
                { label: 'Activos', value: activos, icon: 'mdi-check-circle-outline', color: 'green darken-2', bg: 'green lighten-5' },
                { label: 'Inactivos', value: total - activos, icon: 'mdi-close-circle-outline', color: 'red darken-2', bg: 'red lighten-5' },
            ]
        },
    },

    watch: {
        dialog(val) {
            if (!val) {
                this.editando = false
                this.formaPago = null
            }
        },
    },

    mounted() {
        this.listar()
    },

    methods: {

        /**
         * lista los formaPagos
         */
        async listar() {
            try {
                this.loading = true
                const { data } = await this.$axios.get('forma-pago/listar')
                this.formaPagos = data
            } catch (error) {
                console.log(error.response)
            } finally {
                this.loading = false
            }
        },

        /**
         * cambia el estado
         */
        async cambiarEstado(item) {
            const request = { activo: !item.activo }
            try {
                await this.$axios.put('forma-pago/cambiar-estado/' + item.id, request)
                this.$toast.success('La forma de pago ' + item.nombre + ' paso a estar ' + (request.activo ? "activo" : "Inactivo"))
                this.listar()
            } catch (error) {
                this.$toast.error('Hubo un error al intentar cambiar el estado')
                console.log(error.response)
            }
        },

        /**
         * abre el formulario para crear
         */
        nuevo() {
            this.editando = false
            this.formaPago = null
            this.dialog = true
        },

        /**
         * abre el formulario para editar
         */
        editar(item) {
            this.editando = true
            this.formaPago = item
            this.dialog = true
        },

        /**
         * iniciales para el avatar
         */
        iniciales(nombre) {
            if (!nombre) return '?'
            return nombre.trim().split(/\s+/).slice(0, 2).map(p => p.charAt(0)).join('').toUpperCase()
        },

    },
}
</script>
