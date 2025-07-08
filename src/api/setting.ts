import request from "@/utils/request";
import type { Response } from "@/types/dto";

export interface SettingConfigDTO {
  siteTitle: string; // 站点标题
  siteSubtitle: string; // 站点副标题
  siteUrl: string; // 站点URL
  siteFavicon: string; // 站点图标
  siteAuthor: string; // 站点作者
  siteAnimateText: string; // 站点打字机文本
  siteAvatar: string; // 站点头像
  siteKeywords: string; // 站点关键词
  siteDescription: string; // 站点描述
  siteCopyright: string; // 站点版权
  siteIcp: string; // 站点ICP
  siteIcpLink: string; // 站点ICP链接
  githubUsername: string; // 站点github用户名
}

export interface SettingConfigVO {
  siteTitle: string; // 站点标题
  siteSubtitle: string; // 站点副标题
  siteUrl: string; // 站点URL
  siteFavicon: string; // 站点图标
  siteAuthor: string; // 站点作者
  siteAnimateText: string; // 站点打字机文本
  siteAvatar: string; // 站点头像
  siteKeywords: string; // 站点关键词
  siteDescription: string; // 站点描述
  siteCopyright: string; // 站点版权
  siteIcp: string; // 站点ICP
  siteIcpLink: string; // 站点ICP链接
  githubUsername: string; // 站点github用户名
}

export const adminUpsertSettingAPI: (
  data: SettingConfigDTO
) => Promise<any> = data => {
  return request({
    url: "/admin-api/setting/upsert/site_config",
    method: "POST",
    data,
  });
};

export const getSettingConfigAPI: () => Promise<
  Response<SettingConfigVO>
> = () => {
  return request({
    url: "/setting/site_config",
    method: "GET",
  });
};
