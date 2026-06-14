<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vitepress";

const route = useRoute();

const rules = [
    { match: /^\/api\//, show: false },
    { match: /^\/$/, show: false },
];

const visible = computed(() => {
    return !rules.some((r) => r.match.test(route.path));
});
</script>

<template>
    <div v-if="visible" class="construction-banner">🚧 This documentation is under construction.</div>
</template>

<style scoped>
.construction-banner {
    width: 100%;
    margin: 0;
    padding: 10px 16px;

    background: var(--vp-c-warning-soft);
    border-bottom: 1px solid var(--vp-c-warning-1);

    /* 关键：脱离 doc 盒模型视觉影响 */
    position: relative;
    z-index: 20;
}
</style>
