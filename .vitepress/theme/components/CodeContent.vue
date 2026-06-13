<template>
    <div v-show="shouldShow" class="code-content">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from "vue";

// 注入父组件的 activeTab
const activeTab = inject("codeExampleActiveTab", ref("code"));

const shouldShow = computed(() => activeTab.value === "code");
</script>

