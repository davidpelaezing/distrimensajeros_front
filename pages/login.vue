<template>
    <v-row no-gutters style="min-height: 100vh">
        <!-- Panel de marca (solo escritorio) -->
        <v-col cols="12" md="6" lg="7"
            class="primary d-none d-md-flex flex-column justify-space-between pa-12 white--text"
            style="position: relative; overflow: hidden">

            <!-- Decoración -->
            <v-sheet color="secondary" class="rounded-circle" width="420" height="420"
                style="position: absolute; top: -140px; right: -140px; opacity: .12"></v-sheet>
            <v-sheet color="white" class="rounded-circle" width="300" height="300"
                style="position: absolute; bottom: -120px; left: -90px; opacity: .05"></v-sheet>

            <div class="d-flex align-center fade-up" style="position: relative">
                <v-avatar color="secondary" size="44" rounded="lg" class="mr-3">
                    <v-icon color="primary">mdi-motorbike</v-icon>
                </v-avatar>
                <span class="text-h6 font-weight-bold">Distri Mensajeros</span>
            </div>

            <div style="position: relative; max-width: 520px">
                <div class="d-flex mb-8">
                    <v-avatar v-for="(icono, i) in iconos" :key="icono" size="58" rounded="xl" color="white"
                        class="mr-4 float elevation-6" :style="{ animationDelay: i * 0.6 + 's' }">
                        <v-icon color="primary" size="28">{{ icono }}</v-icon>
                    </v-avatar>
                </div>
                <h1 class="text-h3 font-weight-bold mb-4 fade-up" style="animation-delay: 120ms; line-height: 1.15">
                    Gestiona tus entregas en <span class="secondary--text">un solo lugar</span>
                </h1>
                <p class="text-body-1 mb-0 fade-up" style="animation-delay: 220ms; opacity: .75">
                    Facturas, clientes, mensajeros y reportes organizados para que tu operación fluya sin
                    contratiempos.
                </p>
            </div>

            <div class="text-caption" style="position: relative; opacity: .6">
                &copy; {{ new Date().getFullYear() }} Distri Mensajeros
            </div>
        </v-col>

        <!-- Formulario -->
        <v-col cols="12" md="6" lg="5" class="d-flex align-center justify-center pa-6">
            <div class="fade-up" style="width: 100%; max-width: 400px; animation-delay: 150ms">
                <div class="d-flex d-md-none align-center mb-10">
                    <v-avatar color="primary" size="42" rounded="lg" class="mr-3">
                        <v-icon color="secondary">mdi-motorbike</v-icon>
                    </v-avatar>
                    <span class="text-h6 font-weight-bold primary--text">Distri Mensajeros</span>
                </div>

                <h2 class="text-h4 font-weight-bold primary--text mb-2">Bienvenido</h2>
                <p class="text-body-1 grey--text text--darken-1 mb-8">Ingresa tus credenciales para continuar.</p>

                <LoginComponent />
            </div>
        </v-col>
    </v-row>
</template>
<script>
import LoginComponent from '@/components/auth/LoginComponent.vue';
export default {
    layout: 'guest',
    middleware: 'guest',
    components: {
        LoginComponent
    },
    data: () => ({
        iconos: ['mdi-package-variant-closed', 'mdi-map-marker-path', 'mdi-receipt-text-outline'],
    }),
    head: () => ({
        title: 'Iniciar sesión'
    }),
}
</script>
