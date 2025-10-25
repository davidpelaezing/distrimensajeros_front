import Vue from 'vue'
import moment from 'moment'
import 'moment/locale/es' // opcional: idioma español

moment.locale('es') // establecer idioma por defecto

// Hacer que esté disponible globalmente como $moment
Vue.prototype.$moment = moment
