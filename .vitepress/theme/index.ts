// https://vitepress.dev/guide/custom-theme
import { h } from "vue";
import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import mediumZoom from "medium-zoom";
import { onMounted, watch, nextTick } from "vue";
import { useRoute } from "vitepress";
import "./style.css";
import "./vars.css";
import "./tailwind.css";

// 导入代码示例组件
import CodeExample from "./components/CodeExample.vue";
import CodeContent from "./components/CodeContent.vue";
import CodeDisplay from "./components/CodeDisplay.vue";

// 导入 Plain UI Vue 组件
import PlainUI from "@pcl-community/plain-ui-vue-css-ts";
import "@pcl-community/plain-ui-vue-css-ts/style.css";

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            // https://vitepress.dev/guide/extending-default-theme#layout-slots
        });
    },
    enhanceApp({ app, router, siteData }) {
        // 注册代码示例组件
        app.component("CodeExample", CodeExample);
        app.component("CodeContent", CodeContent);
        app.component("CodeDisplay", CodeDisplay);

        // 注册 Plain UI 组件
        app.use(PlainUI);
    },

    setup() {
        const route = useRoute();
        const initZoom = () => {
            mediumZoom(".main img", { background: "var(--vp-c-bg)" });
        };
        onMounted(() => {
            initZoom();
        });
        watch(
            () => route.path,
            () => nextTick(() => initZoom())
        );
    },
} satisfies Theme;

