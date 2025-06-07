import type { FriendCreateReq, FriendVO } from "@/types/friend";
import request from "@/utils/request";
import type { Response } from "@/types/dto";

export const createFriendAPI = (
  data: FriendCreateReq
): Promise<Response<any>> => {
  return request.post("/friend/create", data);
};

export const getAllFriendAPI = (): Promise<Response<FriendVO[]>> => {
  return request.get("/friend/all");
};
