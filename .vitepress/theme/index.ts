// https://vitepress.dev/guide/custom-theme
import { nextTick, onMounted, watch } from "vue";
import type { Theme } from "vitepress";
import { useData, useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import mediumZoom from "medium-zoom";

// 导入自定义布局文件
import Layout from "./Layout.vue";

// 导入代码示例组件
import CodeExample from "./components/CodeExample.vue";
import CodeContent from "./components/CodeContent.vue";
import CodeDisplay from "./components/CodeDisplay.vue";

// 导入额外组件
import CurrentTime from "./components/CurrentTime.vue";
import MermaidChart from "./components/MermaidChart.vue";

// 导入 Plain UI Vue 组件
import PlainUI from "@pcl-community/plain-ui-vue-css-ts";
import "@pcl-community/plain-ui-vue-css-ts/style.css";
import "@pcl-community/plain-ui-vue-css-ts/theme.css";

// 样式
import "./styles/tailwind.css";
import "./styles/style.css";
import "./styles/vars.css";

export default {
    extends: DefaultTheme,
    Layout,
    enhanceApp({ app, router, siteData }) {
        // 注册代码示例组件
        app.component("CodeExample", CodeExample);
        app.component("CodeContent", CodeContent);
        app.component("CodeDisplay", CodeDisplay);

        // 注册额外组件
        app.component("CurrentTime", CurrentTime);
        app.component("MermaidChart", MermaidChart);

        // 注册 Plain UI 组件
        app.use(PlainUI);
    },

    setup() {
        // Zoom 初始化
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
        // PlainUI Style Class 初始化
        const { isDark } = useData();
        const applyThemeClass = (dark: boolean) => {
            const el = document.documentElement;
            el.classList.remove("light", "dark");
            el.classList.add(dark ? "dark" : "light");
        };
        onMounted(() => {
            document.documentElement.classList.add("color-cat");
            applyThemeClass(isDark.value);
            watch(
                isDark,
                (val) => {
                    applyThemeClass(val);
                },
                { immediate: true }
            );
        });
    },
} satisfies Theme;
