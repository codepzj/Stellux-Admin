// 网站配置请求类型
export interface ConfigReq {
  id?: string;
  type: "home" | "about" | "seo";
  content: Content;
}

// 网站内容
export interface Content {
  // 通用配置
  title: string;
  description: string;

  // 主页配置
  avatar?: string;
  name?: string;
  bio?: string;
  github?: string;
  blog?: string;
  location?: string;
  tech_stacks?: string[];
  repositories?: Repo[];
  quote?: string;
  motto?: string;
  show_recent_posts?: boolean;
  recent_posts_count?: number;
  motto?: string;

  // About页面配置
  skills?: Skill[];
  timeline?: Timeline[];
  interests?: string[];
  focus_items?: string[];

  // SEO配置
  seo_title?: string;
  seo_keywords?: string[];
  seo_description?: string;
  seo_author?: string;
  robots_meta?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_card?: string;
}

// 开源项目
export interface Repo {
  name: string;
  url: string;
  desc: string;
}

// 技能
export interface Skill {
  category: string;
  items: string[];
}

// 时间线项目
export interface Timeline {
  year: string;
  title: string;
  desc: string;
}

// 网站配置VO
export interface ConfigVO {
  id: string;
  created_at: string;
  updated_at: string;
  type: "home" | "about" | "seo";
  content: Content;
}

// 网站配置摘要VO
export interface ConfigSummaryVO {
  id: string;
  type: "home" | "about" | "seo";
  title: string;
  updated_at: string;
}
