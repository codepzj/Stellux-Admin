<template>
  <a-card class="h-full overflow-y-auto">
    <a-page-header title="网站设置" class="px-0!" />

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-12">
      <a-spin size="large" />
    </div>

    <!-- 设置 Tab 内容 -->
    <a-tabs v-else v-model:activeKey="activeKey" @change="handleTabChange">
      <a-tab-pane key="home" tab="主页设置">
        <PageConfigForm
          ref="homeFormRef"
          :config-type="'home'"
          :config="configs.home"
          @update:config="handleConfigUpdate('home', $event)"
        />
        <div
          class="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between"
        >
          <div class="text-sm text-gray-500">
            <span v-if="configs.home?.updated_at">
              最后更新：{{ formatTime(configs.home.updated_at) }}
            </span>
            <span v-else class="text-gray-400">尚未创建</span>
          </div>
          <a-button
            type="primary"
            :loading="saving.home"
            @click="handleSave('home')"
          >
            保存主页设置
          </a-button>
        </div>
      </a-tab-pane>

      <a-tab-pane key="about" tab="关于页设置">
        <PageConfigForm
          ref="aboutFormRef"
          :config-type="'about'"
          :config="configs.about"
          @update:config="handleConfigUpdate('about', $event)"
        />
        <div
          class="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between"
        >
          <div class="text-sm text-gray-500">
            <span v-if="configs.about?.updated_at">
              最后更新：{{ formatTime(configs.about.updated_at) }}
            </span>
            <span v-else class="text-gray-400">尚未创建</span>
          </div>
          <a-button
            type="primary"
            :loading="saving.about"
            @click="handleSave('about')"
          >
            保存关于页设置
          </a-button>
        </div>
      </a-tab-pane>

      <a-tab-pane key="seo" tab="SEO设置">
        <PageConfigForm
          ref="seoFormRef"
          :config-type="'seo'"
          :config="configs.seo"
          @update:config="handleConfigUpdate('seo', $event)"
        />
        <div
          class="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between"
        >
          <div class="text-sm text-gray-500">
            <span v-if="configs.seo?.updated_at">
              最后更新：{{ formatTime(configs.seo.updated_at) }}
            </span>
            <span v-else class="text-gray-400">尚未创建</span>
          </div>
          <a-button
            type="primary"
            :loading="saving.seo"
            @click="handleSave('seo')"
          >
            保存SEO设置
          </a-button>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { message } from "ant-design-vue";
import type { ConfigReq, ConfigVO } from "@/types/config";
import {
  getConfigListAPI,
  getConfigByIdAPI,
  createConfigAPI,
  updateConfigAPI,
} from "@/api/config";
import PageConfigForm from "./components/PageConfigForm.vue";
import { formatTime } from "@/utils/time";

type ConfigType = "home" | "about" | "seo";

const loading = ref(false);
const activeKey = ref<ConfigType>("home");
const saving = reactive({
  home: false,
  about: false,
  seo: false,
});

// 存储各类型的配置
const configs = reactive<{
  home: ConfigVO | null;
  about: ConfigVO | null;
  seo: ConfigVO | null;
}>({
  home: null,
  about: null,
  seo: null,
});

// 存储当前编辑的配置（用于保存）
const currentConfigs = reactive<{
  home: ConfigReq | null;
  about: ConfigReq | null;
  seo: ConfigReq | null;
}>({
  home: null,
  about: null,
  seo: null,
});

// 表单引用
const homeFormRef = ref();
const aboutFormRef = ref();
const seoFormRef = ref();

// 获取所有配置
const fetchAllConfigs = async () => {
  try {
    loading.value = true;
    const res = await getConfigListAPI();
    if (res.code === 200) {
      const configList = res.data || [];

      // 重置配置
      configs.home = null;
      configs.about = null;
      configs.seo = null;
      currentConfigs.home = null;
      currentConfigs.about = null;
      currentConfigs.seo = null;

      // 按类型分类存储
      for (const summary of configList) {
        const detailRes = await getConfigByIdAPI(summary.id);
        if (detailRes.code === 200 && detailRes.data) {
          const type = detailRes.data.type;
          if (type === "home") {
            configs.home = detailRes.data;
            currentConfigs.home = {
              id: detailRes.data.id,
              type: detailRes.data.type,
              content: detailRes.data.content,
            };
          } else if (type === "about") {
            configs.about = detailRes.data;
            currentConfigs.about = {
              id: detailRes.data.id,
              type: detailRes.data.type,
              content: detailRes.data.content,
            };
          } else if (type === "seo") {
            configs.seo = detailRes.data;
            currentConfigs.seo = {
              id: detailRes.data.id,
              type: detailRes.data.type,
              content: detailRes.data.content,
            };
          }
        }
      }
    } else {
      message.error(res.msg || "获取网站设置失败");
    }
  } catch (error) {
    console.error("获取网站设置失败:", error);
    message.error("获取网站设置失败");
  } finally {
    loading.value = false;
  }
};

// Tab 切换处理
const handleTabChange = (key: string) => {
  activeKey.value = key as ConfigType;
  // 如果切换到某个 Tab 且该配置不存在，可以在这里初始化
  // 但通常在表单组件中处理会更好
};

// 配置更新处理
const handleConfigUpdate = (type: ConfigType, config: ConfigReq) => {
  currentConfigs[type] = config;
};

// 保存配置
const handleSave = async (type: ConfigType) => {
  const formRef =
    type === "home"
      ? homeFormRef.value
      : type === "about"
        ? aboutFormRef.value
        : seoFormRef.value;

  if (!formRef) return;

  try {
    // 验证表单
    await formRef.validate();

    const config = currentConfigs[type];
    if (!config) {
      message.error("配置数据不存在，请刷新页面重试");
      return;
    }

    saving[type] = true;

    let res;
    if (config.id) {
      // 更新现有配置
      res = await updateConfigAPI({
        id: config.id,
        type: config.type,
        content: config.content,
      });
    } else {
      // 创建新配置
      res = await createConfigAPI({
        type: config.type,
        content: config.content,
      });
    }

    if (res.code === 200) {
      message.success(res.msg || "保存成功");
      // 重新获取配置列表以更新最后更新时间
      await fetchAllConfigs();
    } else {
      message.error(res.msg || "保存失败");
    }
  } catch (error: any) {
    if (error?.errorFields) {
      // 表单验证失败
      message.warning("请检查表单输入");
    } else {
      console.error("保存失败:", error);
      message.error("保存失败");
    }
  } finally {
    saving[type] = false;
  }
};

onMounted(() => {
  fetchAllConfigs();
});
</script>

<style scoped lang="scss"></style>
