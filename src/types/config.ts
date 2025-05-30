export interface BasicConfig {
  site_title: string; // 站点标题
  site_subtitle: string; // 站点副标题
  site_favicon: string; // 站点favicon
}

export interface SeoConfig {
  site_author: string; // 站点作者
  site_url: string; // 站点URL
  site_description: string; // 站点描述
  site_keywords: string; // 站点关键词
  robots: string; // 站点robots
  og_image: string; // OpenGraph 图像，分享时展示封面
  og_type: string; // OpenGraph 类型，如 'website'，默认也可以写死为 'website'
  twitter_card: string; // Twitter 卡片类型，通常为 'summary_large_image'
  twitter_site: string; // 网站的 Twitter 账号，如 '@codepzj'
}

export interface BlogConfig {
  blog_avatar: string; // 博客头像
  blog_title: string; // 博客标题
  blog_subtitle: string; // 博客副标题
  blog_welcome: string; // 博客欢迎语
  blog_motto: string; // 博客座右铭
}