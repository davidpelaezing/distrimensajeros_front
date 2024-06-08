<template>
    <v-row class="mt-10">
        <v-col class="d-flex justify-center" cols="12">
            <v-img src="logo.png" max-height="150" max-width="360" contain></v-img>
        </v-col>
        <v-col class="mx-auto" cols="12" md="6">
            <LoginComponent />
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

}
</script>