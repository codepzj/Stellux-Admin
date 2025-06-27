import type { FriendCreateReq, FriendUpdateReq, FriendVO } from "@/types/friend";
import request from "@/utils/request";
import type { Response } from "@/types/dto";

/**
 * 创建好友
 * @param data 好友信息
 * @returns 创建结果
 */
export const createFriendAPI = (
  data: FriendCreateReq
): Promise<Response<any>> => {
  return request.post("/friend/create", data);
};

/**
 * 获取所有好友
 * @returns 所有好友
 */
export const getAllFriendAPI = (): Promise<Response<FriendVO[]>> => {
  return request.get("/friend/all");
};

/**
 * 更新好友
 * @param data 好友信息
 * @returns 更新结果
 */
export const updateFriendAPI = (
  data: FriendUpdateReq
): Promise<Response<any>> => {
  return request.put("/friend/update", data);
};

/**
 * 删除好友
 * @param id 好友ID
 * @returns 删除结果
 */
export const deleteFriendAPI = (id: string): Promise<Response<any>> => {
  return request.delete(`/friend/delete/${id}`);
};