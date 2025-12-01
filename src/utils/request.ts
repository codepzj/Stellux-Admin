import axios from "axios";
import { message } from "ant-design-vue";
import { API_BASE_URL } from "@/constant";
import { useUserStore } from "@/store";
import { clearStore } from "./clear";
import router from "@/router";

const request = axios.create({
  baseURL: API_BASE_URL,
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    const userStore = useUserStore();
    const accessToken = userStore.access_token;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
  async response => {
    const { code, error } = response.data;
    // 业务逻辑错误（后端统一返回 HTTP 200，code 200 表示成功）
    if (code !== 200) {
      // 401: 认证失败
      if (code === 401) {
        clearStore();
        message.error("登录已过期, 请重新登录");
        router.replace({ name: "Login" });
        return Promise.reject(new Error("登录已过期"));
      }

      const errMessage = error || "操作失败";
      message.error(errMessage);
      return Promise.reject(new Error(errMessage));
    }

    return response.data;
  },
  error => {
    if (!error.response) {
      message.error("网络错误, 请稍后重试");
    } else {
      message.error(error.response.data?.error || "操作失败");
    }
    return Promise.reject(error);
  }
);

export default request;
