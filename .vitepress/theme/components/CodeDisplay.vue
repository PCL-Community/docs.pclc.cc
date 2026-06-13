<template>
    <div v-show="shouldShow" class="code-display">
        <div class="display-wrapper">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from "vue";

// 注入父组件的 activeTab
const activeTab = inject("codeExampleActiveTab", ref("preview"));

const shouldShow = computed(() => activeTab.value === "preview");
</script>

<style scoped>
.code-display {
    width: 100%;
}

.display-wrapper {
    padding: 24px;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    justify-content: center;
}

/* 允许内容区域根据内容自适应 */
.display-wrapper :deep(> *) {
    width: 100%;
}
</style>

