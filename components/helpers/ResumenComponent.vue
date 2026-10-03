<template>
    <v-row class="mb-2">
        <v-col v-for="(item, i) in items" :key="item.label" cols="12" :sm="items.length > 3 ? 6 : 4"
            :md="Math.floor(12 / Math.max(items.length, 1))">
            <v-card flat class="rounded-xl pa-4 d-flex align-center lift fade-up"
                :style="{ animationDelay: (i + 1) * 80 + 'ms' }">
                <v-avatar size="46" rounded="lg" :color="item.bg">
                    <v-icon :color="item.color">{{ item.icon }}</v-icon>
                </v-avatar>
                <div class="ml-4">
                    <div class="text-caption grey--text text--darken-1 font-weight-medium">{{ item.label }}</div>
                    <div class="text-h5 font-weight-bold text-no-wrap">
                        <v-skeleton-loader v-if="loading" type="text" width="40" class="mt-2" />
                        <span v-else>{{ item.value }}</span>
                    </div>
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>
<script>
/**
 * Tarjetas de resumen (total / activos / inactivos)
 * items: [{ label, value, icon, color, bg }]
 */
export default {
    props: {
        items: { type: Array, default: () => [] },
        loading: { type: Boolean, default: false },
    },
}
</script>
