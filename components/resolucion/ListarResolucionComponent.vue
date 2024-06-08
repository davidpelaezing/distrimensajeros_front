<template>
    <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
        <v-data-table :headers="headers" :items="resoluciones">
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title class="d-flex align-center">
                        Resoluciones
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                                Nueva resolución
                            </v-btn>
                        </template>
                        <FormResolucionComponent :editando="editando" :resolucion="resolucion" @submit="listar()"
                            @cerrar="dialog = false" />
                    </v-dialog>
                </v-toolbar>
            </template>

            <template v-slot:item.actions="{ item }">

                <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon color="primary" @click="editar(item)" v-bind="attrs" v-on="on">
                            mdi-pencil
                        </v-icon>
                    </template>
                    <span>Editar</span>
                </v-tooltip>

            </template>
        </v-data-table>
        <AlertComponent ref="alertComponent" />
    </v-card>
</template>
<script>
import AlertComponent from '@/components/helpers/AlertComponent'
import FormResolucionComponent from '@/components/resolucion/FormResolucionComponent'

export default {
    components: {
        AlertComponent,
        FormResolucionComponent
    },
    data: () => ({
        loading: false,
        editando: false,
        resolucion: {},
        resoluciones: [],
        dialog: false,
        headers: [
            { text: 'Resolución', value: 'resolucion' },
            { text: 'Prefijo', value: 'prefijo' },
            { text: 'Numero inicial', value: 'numero_inicial' },
            { text: 'Numero final', value: 'numero_final' },
            { text: 'Vigencia', value: 'vigencia' },
            { text: 'Fecha inicial', value: 'fecha_inicial' },
            { text: 'Fecha final', value: 'fecha_final' },
            { text: 'Parqueadero', value: 'parqueadero' },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
    }),

    watch: {
        dialog(val) {
            if (!val) {
                this.editando = false;
                this.resolucion = {}
            }
        },
    },

    mounted() {
        this.listar()
    },

    methods: {

        /**
         * lista los resoluciones
         */
        async listar() {
            try {
                const { data } = await this.$axios.get('resolucion/listar')
                this.resoluciones = data
            } catch (error) {
                console.log(error)
                console.log(response.error)
            }
        },

        /**
         * editar
         */
        editar(item) {
            this.editando = true
            this.resolucion = item
            this.dialog = true;
        },

        /**
         * elimina un usuario
         */
        async eliminar(item) {
            try {
                const confirmacion = await this.$refs.alertComponent.show('No se podra recuperar el registro.');
                if (confirmacion) {
                    await this.$axios.delete('resolucion/' + item._id)
                }
                this.listar()
            } catch (error) {
                console.log(error)
                console.log(error.response)
            }
        },

        /**
         * calcula la fecha final, haciendo la suma de fecha inicial + vigencia que esta en meses
         */
        calcularFechaFinal(item) {
            const fechaInicial = new Date(item.fecha_inicial)
            fechaInicial.setMonth(fechaInicial.getMonth() + item.vigencia)
            return this.formatearFecha(fechaInicial)
        },

        /**
         * formatear fecha
         */
        formatearFecha(date) {
            const fecha = new Date(date)
            return fecha.toLocaleDateString()
        }
    }
}

</script>