<script lang="ts" setup>
import { nextTick, onMounted, ref, watch } from "vue";
import { useData } from "vitepress";

const props = defineProps<{
  code: string;
}>();

const { isDark } = useData();

const container = ref<HTMLElement | null>(null);
let renderVersion = 0;

const render = async () => {
  const target = container.value;
  if (!target) {
    return;
  }

  const currentVersion = ++renderVersion;
  const mermaid = (await import("mermaid")).default;

  if (currentVersion !== renderVersion) {
    return;
  }

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: isDark.value ? "dark" : "default",
  });

  try {
    const id = `mermaid-${Date.now()}-${currentVersion}`;
    const code = decodeURIComponent(props.code);
    const { svg, bindFunctions } = await mermaid.render(id, code);

    target.innerHTML = svg;
    bindFunctions?.(target);
  } catch (error) {
    target.innerHTML = "";

    const message = document.createElement("pre");
    message.className = "mermaid-chart-error";
    message.textContent = error instanceof Error ? error.message : String(error);

    target.appendChild(message);
  }
};

onMounted(render);

watch(
    () => [props.code, isDark.value],
    async () => {
      await nextTick();
      await render();
    }
);
</script>

<template>
  <div ref="container" class="mermaid-chart"/>
</template>

<style scoped>
.mermaid-chart {
  margin: 16px 0;
  overflow-x: auto;
}

.mermaid-chart :deep(svg) {
  max-width: 100%;
  height: auto;
}

.mermaid-chart-error {
  margin: 0;
  padding: 12px;
  overflow-x: auto;
  white-space: pre-wrap;
  color: var(--vp-c-danger-1);
  background: var(--vp-c-danger-soft);
  border-radius: 8px;
}
</style>
