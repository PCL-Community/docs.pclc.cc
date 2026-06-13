import { defineConfig, UserConfig } from "vitepress";
import { withSidebar } from "vitepress-sidebar";
import { withI18n } from "vitepress-i18n";
import { VitePressI18nOptions } from "vitepress-i18n/types";
import { generateI18nSidebarConfig } from "./utils/i10nSidebar";
import tailwindcss from "@tailwindcss/vite";

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

    vite: {
        plugins: [tailwindcss()],
    },

    themeConfig: {
        logo: "/logo.png",

        socialLinks: [{ icon: "github", link: "https://github.com/PCL-Community" }],

        footer: {
            message: "Released under the MIT License.",
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

// 注意：withSidebar 必须包裹 withI18n，顺序是 withSidebar(withI18n(config, i18n), sidebar)
export default defineConfig(withSidebar(withI18n(vitepressConfig, i18nConfig), sidebarConfig));
