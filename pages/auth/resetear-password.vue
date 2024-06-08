<template>
    <v-row class="mt-10">
        <v-col class="text-center" cols="12">
            <h1>Reseteo de contraseña</h1>
        </v-col>
        <v-col class="mx-auto" cols="12" md="6">
            <ResetearPasswordComponent />
        </v-col>
    </v-row>
</template>
<script>
import ResetearPasswordComponent from "@/components/auth/ResetearPasswordComponent.vue"
export default {
    layout: "guest",
    components: {
        ResetearPasswordComponent
    },
}
</script>