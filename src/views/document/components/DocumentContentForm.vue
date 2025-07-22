<template>
  <a-form
    ref="formRef"
    :model="formData"
    :rules="rules"
    layout="vertical"
    class="w-full"
  >
    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item label="标题" name="title">
          <a-input
            v-model:value="formData.title"
            placeholder="请输入标题"
            :maxlength="100"
            show-count
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="别名" name="alias">
          <a-input
            v-model:value="formData.alias"
            placeholder="请输入别名"
            :maxlength="50"
            show-count
          />
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item label="描述" name="description">
      <a-textarea
        v-model:value="formData.description"
        placeholder="请输入描述"
        :rows="3"
        :maxlength="200"
        show-count
      />
    </a-form-item>

    <a-row :gutter="16">
      <a-col :span="12">
        <a-form-item label="排序" name="sort">
          <a-input-number
            v-model:value="formData.sort"
            placeholder="请输入排序"
            :min="1"
            :max="100"
            class="w-full"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item label="类型" name="is_dir">
          <a-radio-group v-model:value="formData.is_dir">
            <a-radio :value="false">文档</a-radio>
            <a-radio :value="true">目录</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>
    </a-row>

    <a-form-item label="父级目录" name="parent_id">
      <!-- field-names 用于设置树形选择器的字段名, 兼容antdv的treeData格式 -->
      <a-tree-select
        defaultValue="根目录"
        :tree-data="parent_tree_data"
        placeholder="请选择父级目录"
        allow-clear
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        tree-default-expand-all
        :field-names="{ children: 'children', label: 'title', value: 'key' }"
        tree-node-filter-prop="title"
        @change="onSelectChange"
      />
    </a-form-item>

    <a-form-item
      v-if="!formData.is_dir && props.document_content"
      label="内容"
      name="content"
    >
      <MdWriter v-model:content="formData.content" mode="auto" />
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { FormInstance, TreeProps } from "ant-design-vue";
import MdWriter from "@/components/MdWriter/index.vue";
import type {
  DocumentContentRequest,
  DocumentContentVO,
} from "@/types/document";
import { createDocumentContentAPI } from "@/api/document";

const props = defineProps<{
  document_content?: DocumentContentVO;
  document_id: string;
  parent_id?: string;
  is_dir?: boolean; // 预设类型
  parent_tree_data?: TreeProps["treeData"]; // 父级目录树数据
}>();

const formRef = ref<FormInstance>();

const formData = reactive<DocumentContentRequest & { id?: string }>({
  id: "",
  document_id: props.document_id,
  title: "",
  content: "",
  description: "",
  alias: "",
  parent_id: props.document_id,
  is_dir: props.is_dir || false,
  sort: 1,
});

const rules = {
  title: [
    { required: true, message: "请输入标题", trigger: "blur" },
    { min: 1, max: 20, message: "标题长度在1-20个字符", trigger: "blur" },
  ],
  alias: [
    { required: true, message: "请输入别名", trigger: "blur" },
    { min: 1, max: 20, message: "别名长度在1-20个字符", trigger: "blur" },
  ],
  description: [
    { max: 200, message: "描述长度不能超过200个字符", trigger: "blur" },
  ],
  sort: [
    {
      type: "number",
      min: 1,
      max: 100,
      message: "排序值在1-100之间",
      trigger: "blur",
    },
  ],
  document_id: [{ required: true, message: "文档Id不能为空", trigger: "blur" }],
};

// 监听父级目录变化
const onSelectChange = (value: string) => {
  formData.parent_id = value;
  console.log(formData);
};

// 监听文档内容变化，用于编辑模式
watch(
  () => props.document_content,
  newContent => {
    if (newContent) {
      formData.id = newContent.id;
      formData.document_id = newContent.document_id;
      formData.title = newContent.title;
      formData.content = newContent.content;
      formData.description = newContent.description;
      formData.alias = newContent.alias;
      formData.parent_id = newContent.parent_id;
      formData.is_dir = newContent.is_dir;
      formData.sort = newContent.sort;
    }
  },
  { immediate: true }
);

// 监听documentId变化
watch(
  () => props.document_id,
  newId => {
    formData.document_id = newId;
    if (!formData.parent_id || formData.parent_id === props.document_id) {
      formData.parent_id = newId;
    }
  }
);

// 监听parentId变化
watch(
  () => props.parent_id,
  newParentId => {
    if (newParentId) {
      formData.parent_id = newParentId;
    }
  }
);

// 提交表单
const submit = async () => {
  try {
    await formRef.value?.validate();
    await createDocumentContentAPI({ ...formData });
    resetFields(); // 创建成功后自动重置表单
    return true;
  } catch (error) {
    return false;
  }
};

// 重置表单
const resetFields = () => {
  formRef.value?.resetFields();
  formData.id = "";
  formData.title = "";
  formData.content = "";
  formData.description = "";
  formData.alias = "";
  formData.parent_id = props.parent_id || props.document_id;
  formData.is_dir = false;
  formData.sort = 1;
};

onMounted(() => {
  console.log(props.parent_tree_data);
});

// 暴露方法给父组件
defineExpose({
  submit,
  resetFields,
  formData,
});
</script>

<style lang="scss" scoped>
:deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>
