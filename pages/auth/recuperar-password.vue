<template>
    <v-row class="mt-10">
        <v-col class="text-center" cols="12">
            <h1>Recuperación de contraseña</h1>
        </v-col>
        <v-col class="mx-auto" cols="12" md="6">
            <RecuperarPasswordComponent />
        </v-col>
    </v-row>
</template>
<script>
import RecuperarPasswordComponent from "@/components/auth/RecuperarPasswordComponent.vue"
export default {
    layout: "guest",
    components: {
        RecuperarPasswordComponent
    },
}
</script>