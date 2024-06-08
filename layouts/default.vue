<template>
    <v-app dark>

        <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" fixed app>
            <v-list nav dense>
                <v-list-item-group v-model="selectedItem" color="primary">
                    <v-list-item v-for="(item, i) in items.filter(item => item.roles.includes(getRol()))" :key="i" :to="item.link">
                        <v-list-item-icon>
                            <v-icon v-text="item.icon"></v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title v-text="item.text"></v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>

        </v-navigation-drawer>

        <v-app-bar fixed app>

            <v-btn icon @click="miniVariant = !miniVariant">
                <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
            </v-btn>

            <v-spacer></v-spacer>

            <v-menu rounded="lg" offset-y>
                <template v-slot:activator="{ attrs, on }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-avatar>
                            <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
                        </v-avatar>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>
                                {{ $store.state.auth.authUser.name ? $store.state.auth.authUser.name : '' }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                {{ $store.state.auth.authUser.email ? $store.state.auth.authUser.email : '' }}
                            </v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="submit()">
                        <v-list-item-title>Cerrar sesion</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>

        </v-app-bar>

        <v-main class="fondo">
            <v-container>
                <Nuxt />
            </v-container>
        </v-main>

        <v-footer :absolute="!fixed" app>
            <span>&copy; {{ new Date().getFullYear() }}</span>
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
            drawer: true,
            fixed: false,
            baseURL: null,
            miniVariant: false,
            right: true,
            rightDrawer: false,
            selectedItem: 0,
            items: [
                { text: 'Facturas', icon: 'mdi-note-multiple', link: '/', roles: ['administrador', 'supervisor', 'operario'] },
                { text: 'Clientes', icon: 'mdi-folder', link: '/clientes', roles: ['administrador', 'supervisor', 'operario'] },
                //{ text: 'Resoluciones', icon: 'mdi-book', link: '/resoluciones', roles: ['administrador', 'supervisor'] },
                //{ text: 'Parqueaderos', icon: 'mdi-car', link: '/parqueaderos', roles: ['administrador'] },
                { text: 'Usuarios', icon: 'mdi-account-multiple', link: '/usuarios', roles: ['administrador'] },
            ],
        }
    },
    beforeMount() {
        this.baseURL = this.$axios.defaults.baseURL.replace('api', '');
    },
    methods: {
        ...mapActions('auth', ['logout']),
        ...mapGetters('auth', ['getRol']),
        /**
         * cierra la sesion actual
         */
        async submit() {
            try {
                this.$router.push('/login');
                this.logout()
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