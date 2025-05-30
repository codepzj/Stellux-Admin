import type { BasicConfig, BlogConfig, SeoConfig } from "@/types/config";
import request from "@/utils/request";
import type { Response } from "@/types/dto";

export const adminUpsertSettingAPI: (
  data: BasicConfig
) => Promise<any> = data => {
  return request({
    url: "/admin-api/setting/upsert/basic",
    method: "POST",
    data,
  });
};

export const getBasicSettingAPI: () => Promise<Response<BasicConfig>> = () => {
  return request({
    url: "/setting/basic",
    method: "GET",
  });
};

export const adminUpsertSeoSettingAPI: (
  data: SeoConfig
) => Promise<any> = data => {
  return request({
    url: "/admin-api/setting/upsert/seo",
    method: "POST",
    data,
  });
};

export const getSeoSettingAPI: () => Promise<Response<SeoConfig>> = () => {
  return request({
    url: "/setting/seo",
    method: "GET",
  });
};  

export const adminUpsertBlogSettingAPI: (
  data: BlogConfig
) => Promise<any> = data => {
  return request({
    url: "/admin-api/setting/upsert/blog",
    method: "POST",
    data,
  });
};

export const getBlogSettingAPI: () => Promise<Response<BlogConfig>> = () => {
  return request({
    url: "/setting/blog",
    method: "GET",
  });
};