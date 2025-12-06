<template>
  <a-card class="h-full">
    <a-page-header title="网站设置" class="!px-0">
      <template #extra>
        <a-button type="primary" @click="handleCreate">
          <template #icon>
            <PlusOutlined />
          </template>
          新建
        </a-button>
      </template>
    </a-page-header>

    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center py-12">
      <a-spin size="large" />
    </div>

    <!-- 设置列表 -->
    <div v-else class="space-y-4">
      <div
        v-for="config in pageConfigs"
        :key="config.id"
        class="bg-white border border-gray-200 rounded-lg p-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="text-lg font-medium">
              {{
                config.type === "home"
                  ? "主页设置"
                  : config.type === "about"
                    ? "关于页设置"
                    : "SEO设置"
              }}
            </div>
            <a-tag
              :color="
                config.type === 'home'
                  ? 'blue'
                  : config.type === 'about'
                    ? 'green'
                    : 'orange'
              "
            >
              {{
                config.type === "home"
                  ? "主页"
                  : config.type === "about"
                    ? "关于页面"
                    : "SEO"
              }}
            </a-tag>
            <span class="text-sm text-gray-500">{{
              formatTime(config.updated_at)
            }}</span>
          </div>
          <div class="flex gap-2">
            <a-button size="small" @click="handleEdit(config)">编辑</a-button>
            <a-popconfirm
              title="确定要删除这个设置吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(config.id)"
            >
              <a-button size="small" danger>删除</a-button>
            </a-popconfirm>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && pageConfigs.length === 0" class="text-center py-12">
      <p class="text-gray-500">暂无设置</p>
    </div>

    <!-- 编辑模态框 -->
    <PageConfigModal
      v-model:open="modalVisible"
      :config="currentConfig"
      :loading="modalLoading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    />
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { message } from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import type { ConfigReq, ConfigSummaryVO } from "@/types/config";
import {
  getConfigListAPI,
  getConfigByIdAPI,
  createConfigAPI,
  updateConfigAPI,
  deleteConfigAPI,
} from "@/api/config";
import PageConfigModal from "./components/PageConfigModal.vue";
import { formatTime } from "@/utils/time";

const loading = ref(false);
const modalVisible = ref(false);
const modalLoading = ref(false);
const currentConfig = ref<any>(null);
const pageConfigs = ref<ConfigSummaryVO[]>([]);

// 获取网站设置列表
const fetchPageConfigs = async () => {
  try {
    loading.value = true;
    const res = await getConfigListAPI();
    if (res.code === 200) {
      pageConfigs.value = res.data || [];
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

// 创建网站设置
const handleCreate = () => {
  currentConfig.value = null;
  modalVisible.value = true;
};

// 编辑配置
const handleEdit = async (record: ConfigSummaryVO) => {
  try {
    modalLoading.value = true;
    const res = await getConfigByIdAPI(record.id);
    if (res.code === 200) {
      currentConfig.value = res.data;
      modalVisible.value = true;
    } else {
      message.error(res.msg || "获取配置详情失败");
    }
  } catch (error) {
    console.error("获取配置详情失败:", error);
    message.error("获取配置详情失败");
  } finally {
    modalLoading.value = false;
  }
};

// 删除网站设置
const handleDelete = async (id: string) => {
  try {
    const res = await deleteConfigAPI(id);
    if (res.code === 200) {
      message.success(res.msg || "删除成功");
      await fetchPageConfigs();
    } else {
      message.error(res.msg || "删除失败");
    }
  } catch (error) {
    console.error("删除失败:", error);
    message.error("删除失败");
  }
};

// 模态框确认
const handleModalOk = async (config: ConfigReq) => {
  try {
    modalLoading.value = true;
    let res;
    if (currentConfig.value?.id) {
      // 更新
      res = await updateConfigAPI({
        id: currentConfig.value.id,
        ...config,
      });
    } else {
      // 创建
      res = await createConfigAPI(config);
    }

    if (res.code === 200) {
      message.success(res.msg || "保存成功");
      modalVisible.value = false;
      await fetchPageConfigs();
    } else {
      message.error(res.msg || "保存失败");
    }
  } catch (error) {
    console.error("保存失败:", error);
    message.error("保存失败");
  } finally {
    modalLoading.value = false;
  }
};

// 模态框取消
const handleModalCancel = () => {
  modalVisible.value = false;
  currentConfig.value = null;
};

onMounted(() => {
  fetchPageConfigs();
});
</script>

<style scoped></style>
