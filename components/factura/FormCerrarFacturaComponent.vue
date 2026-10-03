<template>

  <v-card flat class="rounded-xl overflow-hidden">
    <v-progress-linear v-if="loading" indeterminate color="secondary" height="3"></v-progress-linear>

    <div class="d-flex align-center px-6 pt-6 pb-2">
      <v-avatar size="42" rounded="lg" color="green lighten-5" class="mr-3">
        <v-icon color="green darken-2">mdi-cash-register</v-icon>
      </v-avatar>
      <div>
        <div class="text-h6 font-weight-bold">Cerrar factura #{{ factura?.factura }}</div>
        <div class="text-caption grey--text text--darken-1">Registra los pagos recibidos por esta factura</div>
      </div>
      <v-spacer></v-spacer>
      <v-btn icon @click="$emit('cerrar')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>

    <!-- Resumen de la factura -->
    <v-card-text class="px-6 pt-4">
      <v-sheet color="grey lighten-4" class="rounded-lg pa-4">
        <v-row dense>
          <v-col cols="6" md="3">
            <div class="text-caption grey--text text--darken-1">Nro factura</div>
            <div class="font-weight-bold">#{{ factura?.factura }}</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption grey--text text--darken-1">Recibo</div>
            <div class="font-weight-bold">{{ factura?.recibo || '—' }}</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption grey--text text--darken-1">Cliente</div>
            <div class="font-weight-bold text-truncate">{{ factura?.cliente?.nombre || '—' }}</div>
          </v-col>
          <v-col cols="6" md="3">
            <div class="text-caption grey--text text--darken-1">Fecha</div>
            <div class="font-weight-bold">
              {{ factura?.created_at ? $moment(factura.created_at).format('DD/MM/YYYY') : '—' }}
            </div>
          </v-col>
        </v-row>

        <v-divider class="my-3"></v-divider>

        <div class="d-flex flex-wrap align-end">
          <div class="mr-6 mb-1">
            <div class="text-caption grey--text text--darken-1">Total de la factura</div>
            <div class="text-h5 font-weight-bold primary--text">{{ $formatPesos(factura?.valor) }}</div>
          </div>
          <div class="mr-6 mb-1">
            <div class="text-caption grey--text text--darken-1">Pagado</div>
            <div class="text-subtitle-1 font-weight-bold green--text text--darken-2">{{ $formatPesos(totalPagado) }}</div>
          </div>
          <div class="mb-1">
            <div class="text-caption grey--text text--darken-1">Pendiente</div>
            <div class="text-subtitle-1 font-weight-bold orange--text text--darken-3">{{ $formatPesos(saldoPendiente) }}</div>
          </div>
        </div>
        <v-progress-linear :value="porcentajePagado" color="green" background-color="grey lighten-2" height="8" rounded
          class="mt-3"></v-progress-linear>
      </v-sheet>
    </v-card-text>

    <!-- Agregar pago -->
    <v-card-text class="px-6 pt-2 pb-0">
      <div class="text-subtitle-2 font-weight-bold mb-3">
        <v-icon small color="primary" class="mr-1">mdi-plus-circle-outline</v-icon>
        Agregar pago
      </div>
      <v-form v-model="valid" ref="form" lazy-validation :disabled="loading" @submit.prevent="submit()">
        <v-row dense>
          <v-col cols="12" sm="6">
            <v-autocomplete v-model="form.mensajero_id" :items="mensajeros" :rules="rules.mensajero_id" item-value="id"
              item-text="nombre" label="Mensajero" outlined dense prepend-inner-icon="mdi-motorbike"
              no-data-text="Sin resultados"></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6">
            <v-autocomplete v-model="form.forma_pago_id" :items="formasDePago" :rules="rules.forma_pago_id"
              item-value="id" item-text="nombre" label="Forma de pago" outlined dense
              prepend-inner-icon="mdi-credit-card-outline" no-data-text="Sin resultados"></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model.number="form.valor" :rules="rules.valor_id" label="Valor" outlined dense
              prepend-inner-icon="mdi-cash" prefix="$" type="number" min="0" required>
              <template v-slot:append>
                <v-btn v-if="saldoPendiente > 0" x-small text color="primary" class="mt-n1"
                  @click="form.valor = saldoPendiente">Usar saldo</v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea outlined dense rows="2" auto-grow v-model="form.observacion" label="Observación"
              prepend-inner-icon="mdi-comment-text-outline"></v-textarea>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>

    <v-card-actions class="px-6 pb-4 pt-0">
      <v-spacer></v-spacer>
      <v-btn text class="px-4" @click="$emit('cerrar')">Cancelar</v-btn>
      <v-btn color="primary" depressed class="rounded-lg px-5" :loading="loading" @click="submit()">
        <v-icon left small>mdi-cash-plus</v-icon>
        Agregar pago
      </v-btn>
    </v-card-actions>

    <v-divider></v-divider>

    <!-- Pagos registrados -->
    <v-card-text class="px-6 pt-4">
      <div class="d-flex align-center mb-2">
        <span class="text-subtitle-2 font-weight-bold">Pagos registrados</span>
        <v-chip x-small class="ml-2">{{ pagos.length }}</v-chip>
      </div>
      <v-data-table :headers="headers" :items="pagos" :items-per-page="10" dense
        no-data-text="Aún no hay pagos registrados" class="rounded-lg">

        <template v-slot:[`item.forma_pago_id`]="{ item }">
          <v-chip x-small label color="blue-grey lighten-5" text-color="blue-grey darken-2">
            {{ formasDePago.find(f => f.id === item.forma_pago_id)?.nombre || 'Desconocido' }}
          </v-chip>
        </template>
        <template v-slot:[`item.mensajero_id`]="{ item }">
          {{ mensajeros.find(m => m.id === item.mensajero_id)?.nombre || 'Desconocido' }}
        </template>
        <template v-slot:[`item.valor`]="{ item }">
          <span class="font-weight-bold">{{ $formatPesos(item.valor) }}</span>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>

export default {

  props: {
    factura: {
      type: Object
    }
  },

  data() {
    return {
      loading: false,
      valid: false,
      headers: [
        { text: 'Forma de pago', value: 'forma_pago_id' },
        { text: 'Mensajero', value: 'mensajero_id' },
        { text: 'Valor', value: 'valor', align: 'end' }
      ],
      pagos: [],
      mensajeros: [],
      formasDePago: [],
      form: {
        mensajero_id: null,
        forma_pago_id: null,
        valor: null
      },
      rules: {
        mensajero_id: [v => !!v || 'Este campos es requerido'],
        forma_pago_id: [v => !!v || 'Este campo es requerido'],
        valor: [v => !!v || 'Este campo es requerido'],
      }
    }
  },

  watch: {
    factura(val) {
      if (val != null) {
        this.asignarData()
        this.listarPagos()
      }
    },
  },

  computed: {
    totalPagado() {
      return this.pagos.reduce((acc, pago) => acc + (Number(pago.valor) || 0), 0)
    },
    saldoPendiente() {
      const total = Number(this.factura?.valor) || 0
      return Math.max(total - this.totalPagado, 0)
    },
    porcentajePagado() {
      const total = Number(this.factura?.valor) || 0
      return total ? Math.min((this.totalPagado / total) * 100, 100) : 0
    }
  },

  mounted() {
    this.getMensajeros()
    this.getFormasDePago()
    this.listarPagos()
    this.asignarData()
  },

  methods: {

    async listarPagos() {
      try {
        this.loading = true;
        const { data } = await this.$axios.get('factura-detalle/listar-por-factura/' + this.factura.id)
        this.pagos = data
      } catch (error) {
        console.log(error.response)
      } finally {
        this.loading = false
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

    async getFormasDePago() {
      try {
        const { data } = await this.$axios.get('/forma-pago/listar-activos')
        this.formasDePago = data
      } catch (error) {
        this.$toast.error('Error al listar los mensajeros')
      }
    },

    /**
     * Submitea el formulario
     */
    async submit() {
      try {
        if (!this.$refs.form.validate()) {
          return;
        }

        const request = {
          ...this.form,
          factura_id: this.factura.id
        }

        this.loading = true;

        const response = await this.$axios.post('factura-detalle/crear', request);
        this.$toast.success('Detalle creada con exito.')
        this.limpiar();
        this.$emit('cerrar')
      } catch (error) {
        this.$toast.error(error.response.data.error);
        console.log(error.response)
      } finally {
        this.loading = false;
      }
    },

    asignarData() {
      this.form.mensajero_id = this.factura.mensajero_id
    },

    limpiar() {
      this.form = {
        forma_pago_id: 'efectivo',
        valor: null
      }
    },

  }

}

</script>
