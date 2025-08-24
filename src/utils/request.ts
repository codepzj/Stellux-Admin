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
    if (response.data.code !== 0) {
      const errMessage = response.data.msg || "操作失败";
      message.error(errMessage);
      return Promise.reject(new Error(errMessage));
    }

    return response.data;
  },
  error => {
    if (!error.response) {
      message.error("网络错误，请稍后重试");
    } else if (error.response.data.code === 401) {
      clearStore();
      message.error("登录已过期，请重新登录");
      router.replace({ name: "Login" });
      return Promise.reject(new Error("登录已过期"));
    } else {
      message.error(error.response.data.msg || "操作失败");
    }
    return Promise.reject(error);
  }
);

export default request;
