import { VitePressSidebarOptions } from "vitepress-sidebar/types";

const rootLocale = "zhHans";
const supportedLocales = [rootLocale, "en"];

// 文件夹排序顺序，匹配 .temp/Doc/Content 的编号顺序
const folderSortOrder = [
    "getting-started", // 00-开始这里
    "new-user", // 01-新手上路
    "gameplay", // 02-游戏玩法
    "advanced", // 03-进阶功能
    "troubleshooting", // 04-故障排除
    "customization", // 05-个性化
    "external-resources", // 06-外部资源
    "contributing", // 07-参与贡献
];

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
                ...(rootLocale === lang ? {} : { basePath: `/${lang}/` }), // If using `rewrites` option
                documentRootPath: `/docs/${lang}`,
                resolvePath: rootLocale === lang ? "/" : `/${lang}/`,
            };
        }),
    ];
}
