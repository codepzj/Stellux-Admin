import type { SettingConfigDTO, SettingConfigVO } from "@/types/setting";
import request from "@/utils/request";
import type { Response } from "@/types/dto";

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
