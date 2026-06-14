import {VitePressSidebarOptions} from "vitepress-sidebar/types";

const rootLocale = "zhHans";
const supportedLocales = [rootLocale, "en"];

const commonSidebarConfig: VitePressSidebarOptions = {
    documentRootPath: "/docs",
    capitalizeFirst: false,
    useTitleFromFileHeading: true,
    useTitleFromFrontmatter: true,
    useFolderTitleFromIndexFile: true,
    useFolderLinkFromIndexFile: true,
    collapsed: true,
    // collapseDepth 与 collapsed 冲突，当指定 collapseDepth 时，collapsed 只在对应深度生效
    // 如果要所有层级都默认折叠，只使用 collapsed: true，不设置 collapseDepth
    // collapseDepth: 3,
    excludeFilesByFrontmatterFieldName: "exclude",
    sortMenusByFrontmatterOrder: true,
    frontmatterOrderDefaultValue: 999,
};

export function generateI18nSidebarConfig() {
    return [
        ...supportedLocales.map((lang) => {
            return {
                ...commonSidebarConfig,
                ...(rootLocale === lang ? {} : {basePath: `/${lang}/`}), // If using `rewrites` option
                documentRootPath: `/docs/${lang}`,
                resolvePath: rootLocale === lang ? "/" : `/${lang}/`,
            };
        }),
    ];
}
