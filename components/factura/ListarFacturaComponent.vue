<template>
  <v-card :loading="loading" :disabled="loading" elevation="0" class="rounded-xxl pa-4 overflow-hidden">
    <v-card-text>
      <v-data-table :headers="headers" :items="facturas" :search="search" sort-by="calories">
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title class="d-flex align-center">
              Facturas
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                  Nueva factura
                </v-btn>
              </template>
              <FormFacturaComponent @cerrar="dialog = false" @submit="listar()" :editando="editando"
                :factura="factura" />
            </v-dialog>
          </v-toolbar>

          <v-row class="mx-2">
            <v-col cols="12" sm="6" md="4">
              <v-autocomplete v-model="filtro.mensajero_id" :items="mensajeros" item-value="id" item-text="nombre"
                label="Mensajeros"></v-autocomplete>
            </v-col>

            <v-col cols="6" md="3">
              <v-text-field v-model="filtro.fecha_inicio" label="Fecha inicio" type="date" />
            </v-col>

            <v-col cols="6" md="3">
              <v-text-field v-model="filtro.fecha_fin" label="Fecha fin" type="date" />
            </v-col>

            <v-col cols="12" md="3" class="d-flex align-center mt-4">
              <v-btn dark color="green" class="mr-2" @click="listarHistorial">
                Filtrar
              </v-btn>
              <v-btn dark color="red" @click="limpiarFiltros">
                Limpiar
              </v-btn>
            </v-col>
          </v-row>


        </template>

        <template v-slot:item.actions="{ item }">

          <v-chip outlined @click="editar(item)">Editar</v-chip>
          <v-chip color="primary" outlined @click="cerrarFactura(item)">Cerrar</v-chip>

        </template>

      </v-data-table>

      <v-dialog v-model="dialogCerrarFactura" max-width="700px">
        <FormCerrarFacturaComponent @cerrar="dialogCerrarFactura = false" :factura="facturaCerrar" />
      </v-dialog>


    </v-card-text>

    <AlertComponent ref="alertComponent" />

  </v-card>
</template>
<script>

import AlertComponent from "@/components/helpers/AlertComponent";
import FormFacturaComponent from "@/components/factura/FormFacturaComponent";
import FormCerrarFacturaComponent from "@/components/factura/FormCerrarFacturaComponent";

import { mapGetters, mapState } from "vuex";

export default {
  components: {
    AlertComponent,
    FormFacturaComponent,
    FormCerrarFacturaComponent
  },

  data: () => ({
    factura: {},
    facturaCerrar: {},
    facturas: [],
    mensajeros: [],
    editando: false,
    loading: false,
    search: '',
    dialog: false,
    dialogCerrarFactura: false,
    filtro: {
      mensajero_id: null,
      fecha_fin: null,
      fecha_inicio: null,
    },
    headers: [
      {
        text: "Fecha",
        value: "created_at",
      },
      {
        text: "Nro factura",
        value: "factura",
        sortable: false,
      },
      {
        text: "Recibo",
        value: "recibo",
        sortable: false,
      },
      {
        text: "Mensajero",
        value: "mensajero.nombre",
        sortable: false,
      },
      {
        text: "Cliente",
        value: "cliente.nombre",
        sortable: false,
      },
      {
        text: "Valor",
        value: "valor",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
      }
    ],
  }),

  watch: {
    dialog(valor) {
      if (!valor) {
        this.editando = false;
        this.factura = {};
      }
    },

    dialogCerrarFactura(valor) {
      if (!valor) {
        this.facturaCerrar = {};
        this.listar()
      }
    }

  },

  mounted() {
    this.listar()
    this.getMensajeros()
  },

  methods: {

    async listar() {
      try {
        const { data } = await this.$axios.get('factura/listar')
        this.facturas = data
      } catch (error) {
        console.log('Erro al listar')
      }
    },

    async listarHistorial() {
      try {
        const { mensajero_id, fecha_inicio, fecha_fin } = this.filtro;

        if (!mensajero_id && !fecha_inicio && !fecha_fin) {
          return this.listar();
        }

        const { data } = await this.$axios.get('factura/listar-historial-factura', {
          params: {
            mensajero_id,
            fecha_inicio,
            fecha_fin
          }
        });

        this.facturas = data;

      } catch (error) {
        console.error('Error al listar historial de facturas:', error);
        this.facturas = [];
      }
    },

    async getMensajeros() {
      try {
        const { data } = await this.$axios.get('/mensajero/listar-activos')
        this.mensajeros = data
      } catch (error) {
        this.$toast.error('Error al listar los mensajeros')
      }
    },

    editar(item) {
      this.dialog = true;
      this.editando = true;
      this.factura = item;
    },

    cerrarFactura(item) {
      this.dialogCerrarFactura = true;
      this.facturaCerrar = item
    },

    limpiarFiltros() {
      this.filtro.mensajero_id = null;
      this.filtro.fecha_inicio = null;
      this.filtro.fecha_fin = null;
      this.listar();
    }

  }
};
</script>
