<template>
    <div class="d-flex flex-wrap align-center mb-6 fade-up">
        <v-avatar size="52" color="primary" rounded="lg" class="mr-4 elevation-4">
            <v-icon dark>{{ icon }}</v-icon>
        </v-avatar>
        <div class="mr-auto">
            <h1 class="text-h5 font-weight-bold primary--text">{{ title }}</h1>
            <p v-if="subtitle" class="text-body-2 grey--text text--darken-1 mb-0">{{ subtitle }}</p>
        </div>
        <div class="mt-4 mt-sm-0">
            <slot />
        </div>
    </div>
</template>
<script>
export default {
    props: {
        title: { type: String, required: true },
        subtitle: { type: String, default: '' },
        icon: { type: String, default: 'mdi-view-dashboard-outline' },
    },
}
</script>
