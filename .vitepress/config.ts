import { defineConfig, UserConfig } from "vitepress";
import { withSidebar } from "vitepress-sidebar";
import { withI18n } from "vitepress-i18n";
import type { VitePressI18nOptions } from "vitepress-i18n/types";
import tailwindcss from "@tailwindcss/vite";
import { generateI18nSidebarConfig } from "./utils/i10nSidebar";

const vitepressConfig: UserConfig = {
    srcDir: "docs",

    title: "PCLC Docs",
    description: "适用于 PCL Community 相关项目的统一文档",
    lastUpdated: true,
    head: [["link", { rel: "icon", href: "/logo.png" }]],
    lang: "zh-CN",
    cleanUrls: true,
    metaChunk: true,

    rewrites: {
        "zhHans/:rest*": ":rest*",
    },

    markdown: {
        config(md) {
            const defaultFence = md.renderer.rules.fence;
            md.renderer.rules.fence = (tokens, idx, options, env, self) => {
                const token = tokens[idx];
                const language = token.info.trim().split(/\s+/)[0];

                if (language === "mermaid" || language === "mmd") {
                    const code = encodeURIComponent(token.content);
                    return `<ClientOnly><MermaidChart code="${code}" /></ClientOnly>`;
                }

                return defaultFence
                    ? defaultFence(tokens, idx, options, env, self)
                    : self.renderToken(tokens, idx, options);
            };
        },
    },

    vite: {
        plugins: [
            tailwindcss(),
        ],
    },

    themeConfig: {
        logo: "/logo.png",

        socialLinks: [{ icon: "github", link: "https://github.com/PCL-Community" }],

        footer: {
            message: "Released under the Creative Commons Attribution-ShareAlike 4.0 International Public License (CC BY-SA 4.0).",
            copyright: 'Copyright © <a href="https://github.com/PCL-Community">PCL Community</a>',
        },
        editLink: {
            pattern: "https://github.com/PCL-Community/docs.pclc.cc/edit/main/docs/:path",
        },
    },
};

const sidebarConfig = generateI18nSidebarConfig();

const i18nConfig: VitePressI18nOptions = {
    locales: ["zhHans", "en"],
    searchProvider: "local",
    rootLocale: "zhHans",
    themeConfig: {
        en: {
            nav: [
                {
                    text: "Home",
                    link: "/",
                },
                {
                    text: "Project List",
                    link: "/en/projects",
                },
                {
                    text: "Official Website",
                    link: "https://www.pclc.cc",
                },
            ],
        },
        zhHans: {
            nav: [
                {
                    text: "主页",
                    link: "/",
                },
                {
                    text: "项目列表",
                    link: "/projects",
                },
                {
                    text: "官网",
                    link: "https://www.pclc.cc",
                },
            ],
        },
    },
};

const combinedConfig = withSidebar(
    withI18n(vitepressConfig, i18nConfig),
    sidebarConfig
);

export default defineConfig(combinedConfig);
