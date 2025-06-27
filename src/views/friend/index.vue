<template>
  <div class="h-full">
    <!-- 表格与操作区域 -->
    <a-page-header class="!px-0">
      <div class="flex justify-between">
        <a-button type="primary" @click="onHandleCreate">新增</a-button>
      </div>
    </a-page-header>

    <a-table
      :columns="columns"
      :data-source="friendList"
      :loading="loading"
      rowKey="id"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'name'">
          <span>{{ record.name }}</span>
        </template>
        <template v-else-if="column.key === 'description'">
          <div class="line-clamp-2 text-gray-500">{{ record.description }}</div>
        </template>
        <template v-else-if="column.key === 'site_url'">
          <a-typography-link :href="record.site_url" target="_blank">
            {{ record.site_url }}
          </a-typography-link>
        </template>
        <template v-else-if="column.key === 'avatar_url'">
          <a-avatar :src="record.avatar_url" />
        </template>
        <template v-else-if="column.key === 'website_type'">
          <span>{{ record.website_type }}</span>
        </template>
        <template v-else-if="column.key === 'is_active'">
          <a-tag :color="record.is_active ? 'green' : 'red'">
            {{ record.is_active ? "已启用" : "未启用" }}
          </a-tag>
        </template>

        <template v-else-if="column.key === 'action'">
          <span>
            <a-button size="small" type="link" @click="onHandleEdit(record)"
              >编辑</a-button
            >
            <a-divider type="vertical" />
            <a-popconfirm
              placement="bottomRight"
              title="确定删除该友链吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="handleDelete(record.id)"
            >
              <a-button size="small" type="link" danger>删除</a-button>
            </a-popconfirm>
          </span>
        </template>
      </template>
    </a-table>

    <!-- 新增弹窗 -->
    <a-modal
      v-model:open="createModalOpen"
      title="新增友链"
      @ok="handleCreateOk"
    >
      <a-form ref="createFormRef" :model="createForm" :rules="rules">
        <a-form-item label="名称" name="name">
          <a-input v-model:value="createForm.name" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-input v-model:value="createForm.description" />
        </a-form-item>
        <a-form-item label="站点URL" name="site_url">
          <a-input v-model:value="createForm.site_url" />
        </a-form-item>
        <a-form-item label="头像URL" name="avatar_url">
          <a-input v-model:value="createForm.avatar_url" />
        </a-form-item>
        <a-form-item label="网站类型" name="website_type">
          <a-input v-model:value="createForm.website_type" />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑弹窗 -->
    <a-modal v-model:open="editModalOpen" title="编辑友链" @ok="handleEditOk">
      <a-form ref="editFormRef" :model="editForm" :rules="rules">
        <a-form-item label="名称" name="name">
          <a-input v-model:value="editForm.name" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-input v-model:value="editForm.description" />
        </a-form-item>
        <a-form-item label="站点URL" name="site_url">
          <a-input v-model:value="editForm.site_url" />
        </a-form-item>
        <a-form-item label="头像URL" name="avatar_url">
          <a-input v-model:value="editForm.avatar_url" />
        </a-form-item>
        <a-form-item label="网站类型" name="website_type">
          <a-input v-model:value="editForm.website_type" />
        </a-form-item>
        <a-form-item label="是否激活" name="is_active">
          <a-switch v-model:checked="editForm.is_active" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { message, type FormInstance, type Rule } from "ant-design-vue";
import {
  createFriendAPI,
  getAllFriendAPI,
  updateFriendAPI,
  deleteFriendAPI,
} from "@/api/friend";
import type {
  FriendVO,
  FriendCreateReq,
  FriendUpdateReq,
} from "@/types/friend";

// 数据列表和加载状态
const friendList = ref<FriendVO[]>([]);
const loading = ref(false);

const rules: Record<string, Rule[]> = {
  name: [
    {
      required: true,
      message: "请输入名称",
    },
  ],
  description: [
    {
      required: true,
      message: "请输入描述",
    },
  ],
  site_url: [
    {
      required: true,
      message: "请输入站点URL",
    },
  ],
  avatar_url: [
    {
      required: true,
      message: "请输入头像URL",
    },
  ],
  website_type: [
    {
      required: true,
      message: "请输入网站类型",
    },
  ],
};

const getFriendList = async () => {
  loading.value = true;
  const res = await getAllFriendAPI();
  friendList.value = res.data;
  loading.value = false;
};

// 新增逻辑
const createModalOpen = ref(false);
const createFormRef = ref<FormInstance>();
const createForm = ref<FriendCreateReq>({
  name: "",
  description: "",
  site_url: "",
  avatar_url: "",
  website_type: "",
});

const onHandleCreate = () => {
  createForm.value = {
    name: "",
    description: "",
    site_url: "",
    avatar_url: "",
    website_type: "",
  };
  createModalOpen.value = true;
};

const handleCreateOk = async () => {
  await createFormRef.value?.validate();
  const res = await createFriendAPI(createForm.value);
  message.success(res.msg);
  createModalOpen.value = false;
  await getFriendList();
};

// 编辑逻辑

const editModalOpen = ref(false);
const editFormRef = ref<FormInstance>();
const editForm = ref<FriendUpdateReq>({
  id: "",
  name: "",
  description: "",
  site_url: "",
  avatar_url: "",
  website_type: "",
  is_active: true,
});

const onHandleEdit = (record: FriendVO) => {
  editForm.value = {
    id: record.id,
    name: record.name,
    description: record.description,
    site_url: record.site_url,
    avatar_url: record.avatar_url,
    website_type: record.website_type,
    is_active: record.is_active,
  };
  editModalOpen.value = true;
};

const handleEditOk = async () => {
  await editFormRef.value?.validate();
  const res = await updateFriendAPI(editForm.value);
  message.success(res.msg);
  editModalOpen.value = false;
  await getFriendList();
};

const handleDelete = async (id: string) => {
  const res = await deleteFriendAPI(id);
  message.success(res.msg);
  await getFriendList();
};
// 表格列定义
const columns = [
  { title: "名称", key: "name" },
  { title: "描述", key: "description" },
  { title: "站点URL", key: "site_url" },
  { title: "头像URL", key: "avatar_url" },
  { title: "网站类型", key: "website_type" },
  { title: "是否激活", key: "is_active" },
  { title: "操作", key: "action", width: 150, fixed: "right" },
];

onMounted(async () => {
  await getFriendList();
});
</script>
