<template>
    <v-app>

        <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" color="primary" dark fixed app
            width="264" mini-variant-width="80" floating>

            <!-- Marca -->
            <div class="d-flex align-center px-4 py-5" :class="{ 'justify-center px-0': miniVariant }">
                <v-avatar color="secondary" size="42" rounded="lg">
                    <v-icon color="primary">mdi-motorbike</v-icon>
                </v-avatar>
                <v-fade-transition>
                    <div v-if="!miniVariant" class="ml-3" style="line-height: 1.15">
                        <div class="text-subtitle-1 font-weight-bold">Distri</div>
                        <div class="text-caption secondary--text font-weight-bold">MENSAJEROS</div>
                    </div>
                </v-fade-transition>
            </div>

            <div v-if="!miniVariant" class="text-overline px-6 mt-2" style="opacity: .5">Menú</div>

            <v-list nav class="px-3">
                <v-tooltip v-for="item in menu" :key="item.link" right :disabled="!miniVariant">
                    <template v-slot:activator="{ on, attrs }">
                        <v-list-item :to="item.link" :exact="item.link === '/'" active-class="secondary primary--text"
                            class="rounded-lg mb-1" v-bind="attrs" v-on="on">
                            <v-list-item-icon>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content>
                                <v-list-item-title class="font-weight-medium">{{ item.text }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                    <span>{{ item.text }}</span>
                </v-tooltip>
            </v-list>

            <!-- Usuario -->
            <template v-slot:append>
                <div class="pa-3">
                    <v-sheet class="rounded-xl d-flex align-center pa-2"
                        style="background-color: rgba(255, 255, 255, .08)">
                        <v-avatar color="secondary" size="38" class="flex-shrink-0">
                            <span class="primary--text font-weight-bold text-body-2">{{ iniciales }}</span>
                        </v-avatar>
                        <template v-if="!miniVariant">
                            <div class="ml-3 text-truncate" style="min-width: 0">
                                <div class="text-body-2 font-weight-bold text-truncate">{{ usuario.name }}</div>
                                <div class="text-caption text-capitalize" style="opacity: .6">{{ getRol() }}</div>
                            </div>
                            <v-spacer></v-spacer>
                            <v-tooltip top>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn icon small v-bind="attrs" v-on="on" @click="submit()">
                                        <v-icon small>mdi-logout</v-icon>
                                    </v-btn>
                                </template>
                                <span>Cerrar sesión</span>
                            </v-tooltip>
                        </template>
                    </v-sheet>
                </div>
            </template>
        </v-navigation-drawer>

        <v-app-bar fixed app flat color="fondo" height="72">

            <v-btn icon @click="toggleMenu">
                <v-icon>{{ $vuetify.breakpoint.mdAndDown ? 'mdi-menu' : (miniVariant ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left') }}</v-icon>
            </v-btn>

            <div class="ml-2">
                <div class="text-caption grey--text text--darken-1">Distri Mensajeros</div>
                <div class="text-subtitle-1 font-weight-bold primary--text" style="line-height: 1.1">{{ tituloPagina }}</div>
            </div>

            <v-spacer></v-spacer>

            <v-chip v-if="$vuetify.breakpoint.smAndUp" small color="white" class="mr-3 grey--text text--darken-2">
                <v-icon x-small left>mdi-calendar-blank-outline</v-icon>
                {{ fechaHoy }}
            </v-chip>

            <v-menu rounded="xl" offset-y left transition="slide-y-transition" min-width="240">
                <template v-slot:activator="{ attrs, on }">
                    <v-btn icon large v-bind="attrs" v-on="on">
                        <v-avatar color="primary" size="40">
                            <span class="white--text font-weight-bold text-body-2">{{ iniciales }}</span>
                        </v-avatar>
                    </v-btn>
                </template>

                <v-card flat>
                    <div class="d-flex align-center pa-4">
                        <v-avatar color="primary" size="44">
                            <span class="white--text font-weight-bold">{{ iniciales }}</span>
                        </v-avatar>
                        <div class="ml-3 text-truncate">
                            <div class="font-weight-bold text-truncate">{{ usuario.name || '' }}</div>
                            <div class="text-caption grey--text text-truncate">{{ usuario.email || '' }}</div>
                        </div>
                    </div>
                    <v-divider></v-divider>
                    <v-list dense nav>
                        <v-list-item @click="submit()">
                            <v-list-item-icon class="mr-3">
                                <v-icon color="error" small>mdi-logout</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title class="error--text">Cerrar sesión</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-menu>

        </v-app-bar>

        <v-main class="fondo">
            <v-container fluid class="px-4 px-md-8 pb-8">
                <Nuxt />
            </v-container>
        </v-main>

        <v-footer app inset color="fondo" class="justify-center">
            <span class="text-caption grey--text">&copy; {{ new Date().getFullYear() }} Distri Mensajeros</span>
        </v-footer>
    </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'DefaultLayout',
    middleware: 'auth',
    data() {
        return {
            clipped: false,
            drawer: null,
            fixed: false,
            baseURL: null,
            miniVariant: false,
            right: true,
            rightDrawer: false,
            selectedItem: 0,
            items: [
                { text: 'Facturas', icon: 'mdi-note-multiple', link: '/', roles: ['administrador', 'supervisor', 'operario'] },
                { text: 'Clientes', icon: 'mdi-account-multiple-check', link: '/clientes', roles: ['administrador', 'supervisor', 'operario'] },
                { text: 'Mensajeros', icon: 'mdi-motorbike', link: '/mensajeros', roles: ['administrador', 'supervisor'] },
                { text: 'Formas de pago', icon: 'mdi-credit-card-multiple-outline', link: '/forma-pagos', roles: ['administrador', 'supervisor'] },
                { text: 'Reportes', icon: 'mdi-file-chart', link: '/reportes', roles: ['administrador', 'supervisor'] },
                { text: 'Usuarios', icon: 'mdi-account-multiple', link: '/usuarios', roles: ['administrador'] },
            ],
        }
    },
    computed: {
        usuario() {
            return this.$store.state.auth.authUser || {};
        },
        menu() {
            return this.items.filter(item => item.roles.includes(this.getRol()));
        },
        iniciales() {
            const nombre = (this.usuario.name || '').trim();
            if (!nombre) return '?';
            return nombre.split(/\s+/).slice(0, 2).map(p => p.charAt(0)).join('').toUpperCase();
        },
        tituloPagina() {
            const actual = this.items.find(item => item.link === this.$route.path);
            return actual ? actual.text : 'Facturas';
        },
        fechaHoy() {
            return this.$moment().format('dddd, D [de] MMMM');
        },
    },
    beforeMount() {
        this.baseURL = this.$axios.defaults.baseURL.replace('api', '');
    },
    methods: {
        ...mapActions('auth', ['logout']),
        /**
         * En pantallas pequeñas abre/cierra el menú, en escritorio lo colapsa
         */
        toggleMenu() {
            if (this.$vuetify.breakpoint.mdAndDown) {
                this.drawer = !this.drawer;
            } else {
                this.miniVariant = !this.miniVariant;
            }
        },
        ...mapGetters('auth', ['getRol']),
        /**
         * cierra la sesion actual
         */
        async submit() {
            try {
                await this.logout()
                this.$router.push('/login');
            } catch (error) {
                console.error(error);
                console.error(error.response);
            }
        },

        /**
         * Cambia el idioma de la aplicacion
         * @param {String} code
         */
        cambiarIdioma(code) {
            if (this.$i18n.locale != code) {
                this.$i18n.locale = code;
            }
        }
    }

}
</script>
<style>
.color-transition {
    transition: background-color 0.6s ease;
    /* Ajusta la duración y el tipo de transición según tus preferencias */
}
</style>