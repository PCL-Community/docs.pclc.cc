import type { Config } from "tailwindcss";

export default {
    content: ["./docs/**/*.{md,vue,ts,js}", "./.vitepress/**/*.{vue,ts,js}"],
    theme: {
        extend: {
            // 可以在这里扩展主题
        },
    },
    plugins: [],
} satisfies Config;

