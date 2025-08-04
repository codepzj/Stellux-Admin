import type { UserInfoVO } from "@/types/user";

export const useUserStore = defineStore(
  "user",
  () => {
    const access_token = ref<string | null>(null);
    const userInfo = ref<UserInfoVO | null>(null);

    const setAccessToken = (accessToken: string) => {
      access_token.value = accessToken;
    };

    const setUserInfo = (newUserInfo: UserInfoVO) => {
      userInfo.value = newUserInfo;
    };

    const clearAccessToken = () => {
      access_token.value = null;
    };

    const ResetUserStore = () => {
      userInfo.value = null;
      access_token.value = null;
    };

    return {
      access_token,
      userInfo,
      setAccessToken,
      clearAccessToken,
      setUserInfo,
      ResetUserStore,
    };
  },
  {
    persist: true,
  }
);
