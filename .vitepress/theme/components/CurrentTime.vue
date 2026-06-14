<template>
    <span>{{ currentTime }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const currentTime = ref(new Date().toLocaleString());

onMounted(() => {
    const intervalId = setInterval(() => {
        currentTime.value = new Date().toLocaleString();
    }, 1000);
    onUnmounted(() => {
        clearInterval(intervalId);
    });
});
</script>
