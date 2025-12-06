import type { ConfigReq, ConfigVO, ConfigSummaryVO } from "@/types/config";
import type { Response } from "@/types/dto";
import request from "@/utils/request";

// 创建网站配置
export const createConfigAPI: (
  data: ConfigReq
) => Promise<Response<any>> = data => {
  return request.post("/admin-api/config/create", data);
};

// 更新网站配置
export const updateConfigAPI: (
  data: ConfigReq
) => Promise<Response<any>> = data => {
  return request.put("/admin-api/config/update", data);
};

// 删除网站配置
export const deleteConfigAPI: (id: string) => Promise<Response<any>> = id => {
  return request.delete(`/admin-api/config/${id}`);
};

// 获取网站配置列表
export const getConfigListAPI: () => Promise<
  Response<ConfigSummaryVO[]>
> = () => {
  return request.get("/admin-api/config/list");
};

// 根据ID获取网站配置
export const getConfigByIdAPI: (
  id: string
) => Promise<Response<ConfigVO>> = id => {
  return request.get(`/admin-api/config/${id}`);
};
