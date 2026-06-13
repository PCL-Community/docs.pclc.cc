<template>
    <div class="code-example">
        <div class="code-example-header">
            <span class="code-example-title">{{ title }}</span>
            <div class="code-example-tabs">
                <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    :class="['code-example-tab', { active: activeTab === tab.id }]"
                    @click="activeTab = tab.id as 'code' | 'preview'">
                    {{ tab.label }}
                </button>
            </div>
        </div>
        <div class="code-example-content">
            <slot :active-tab="activeTab" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, provide } from "vue";

interface Props {
    title?: string;
    defaultTab?: "code" | "preview";
}

const props = withDefaults(defineProps<Props>(), {
    title: "代码示例",
    defaultTab: "preview",
});

const activeTab = ref(props.defaultTab);

const tabs = computed(() => [
    { id: "preview", label: "效果预览" },
    { id: "code", label: "代码" },
]);

// 提供 activeTab 给子组件
provide("codeExampleActiveTab", activeTab);
</script>

<style scoped>
.code-example {
    margin: 16px 0;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    overflow: hidden;
    background: var(--vp-c-bg-soft);
}

.code-example-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--vp-c-bg);
    border-bottom: 1px solid var(--vp-c-divider);
}

.code-example-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-text-1);
}

.code-example-tabs {
    display: flex;
    gap: 4px;
}

.code-example-tab {
    padding: 4px 12px;
    font-size: 13px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--vp-c-text-2);
    cursor: pointer;
    transition: all 0.2s;
}

.code-example-tab:hover {
    color: var(--vp-c-text-1);
    background: var(--vp-c-bg-soft);
}

.code-example-tab.active {
    color: var(--vp-c-brand-1);
    background: var(--vp-c-brand-soft);
}

.code-example-content {
    padding: 16px;
}
</style>

