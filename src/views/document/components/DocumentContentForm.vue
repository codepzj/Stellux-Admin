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
        <a-form-item v-if="!formData.is_dir" label="别名" name="alias">
          <a-input
            v-model:value="formData.alias"
            placeholder="请输入别名"
            :maxlength="50"
            show-count
          />
        </a-form-item>
      </a-col>
    </a-row>
    <!-- 描述【非目录】 -->
    <a-form-item v-if="!formData.is_dir" label="描述" name="description">
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
        v-model:value="formData.parent_id"
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
  </a-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, nextTick } from "vue";
import type { FormInstance, TreeProps } from "ant-design-vue";
import type {
  DocumentContentRequest,
  DocumentContentVO,
  DocumentTreeVO,
} from "@/types/document";
import { createDocumentContentAPI } from "@/api/document";

const props = defineProps<{
  document_content?: DocumentContentVO;
  document_id: string;
  parent_id?: string;
  is_dir?: boolean; // 预设类型
  parent_tree_data?: TreeProps["treeData"]; // 父级目录树数据
  doc_tree_data?: DocumentTreeVO[]; // 文档树数据，用于计算排序
}>();

const formRef = ref<FormInstance>();

// 初始化排序值
const getInitialSort = (parentId: string): number => {
  if (!props.doc_tree_data || !parentId) {
    return 1;
  }
  const count = props.doc_tree_data.filter(
    item => item.parent_id === parentId
  ).length;
  return count + 1;
};

const formData = reactive<DocumentContentRequest & { id?: string }>({
  id: "",
  document_id: props.document_id,
  title: "",
  content: "",
  description: "",
  alias: "",
  parent_id: props.parent_id || props.document_id,
  is_dir: props.is_dir || false,
  sort: getInitialSort(props.parent_id || props.document_id),
});

const checkAlias = (_rule: any, value: string) => {
  if (formData.is_dir) {
    return Promise.resolve();
  }
  if (!value) {
    return Promise.reject(new Error("别名不能为空"));
  }
  return Promise.resolve();
};

const rules = {
  title: [
    { required: true, message: "请输入标题", trigger: "blur" },
    { min: 1, max: 20, message: "标题长度在1-20个字符", trigger: "blur" },
  ],
  alias: [
    { validator: checkAlias, message: "请输入别名", trigger: "blur" },
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

// 计算父级目录下的文档数量
const getChildrenCountByParentId = (parentId: string): number => {
  if (!props.doc_tree_data || !parentId) {
    console.log("计算排序值 - doc_tree_data 或 parentId 为空", {
      doc_tree_data: props.doc_tree_data,
      parentId,
    });
    return 0;
  }
  // 过滤出所有 parent_id 等于指定 parentId 的文档
  const children = props.doc_tree_data.filter(
    item => item.parent_id === parentId
  );
  console.log("计算排序值", {
    parentId,
    childrenCount: children.length,
    children: children.map(c => ({ id: c.id, title: c.title })),
  });
  return children.length;
};

// 更新排序值的方法，供外部调用
const updateSortValue = () => {
  if (formData.parent_id && !formData.id) {
    // 只有在新增模式下才自动更新排序值
    const count = getChildrenCountByParentId(formData.parent_id);
    formData.sort = count + 1;
    console.log("更新排序值", {
      parent_id: formData.parent_id,
      count,
      sort: formData.sort,
    });
  }
};

// 监听父级目录变化
const onSelectChange = (value: string) => {
  formData.parent_id = value;
  // 当父级目录改变时，自动更新排序值为该目录下已有文档数量 + 1
  if (value && !formData.id) {
    // 使用 nextTick 确保数据已经准备好
    nextTick(() => {
      const count = getChildrenCountByParentId(value);
      formData.sort = count + 1;
      console.log("父级目录变化，更新排序值", {
        parent_id: value,
        count,
        sort: formData.sort,
      });
    });
  }
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
  },
  { immediate: true }
);

// 监听parentId变化
watch(
  () => props.parent_id,
  newParentId => {
    console.log("props.parent_id 变化", newParentId);
    if (newParentId && !formData.id) {
      // 只有在新增模式下才自动更新排序值
      formData.parent_id = newParentId;
      // 使用 nextTick 确保数据已经准备好
      nextTick(() => {
        updateSortValue();
      });
    } else if (newParentId) {
      formData.parent_id = newParentId;
    }
  },
  { immediate: true }
);

// 监听is_dir变化
watch(
  () => props.is_dir,
  newIsDir => {
    formData.is_dir = newIsDir;
  },
  { immediate: true }
);

// 监听文档树数据变化，当数据更新时重新计算排序值
watch(
  () => props.doc_tree_data,
  () => {
    updateSortValue();
  },
  { deep: true, immediate: false }
);

// 监听 parent_id 和 doc_tree_data 同时变化
watch(
  [() => props.parent_id, () => props.doc_tree_data],
  ([newParentId, newDocTreeData]) => {
    if (newParentId && newDocTreeData && !formData.id) {
      // 使用 nextTick 确保数据已经更新
      nextTick(() => {
        updateSortValue();
      });
    }
  },
  { immediate: false }
);

onMounted(() => {
  console.log("DocumentContentForm mounted", {
    props,
    formData,
    doc_tree_data_length: props.doc_tree_data?.length,
  });
  // 初始化时计算排序值，使用 nextTick 确保数据已经准备好
  nextTick(() => {
    updateSortValue();
  });
});

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
  const parentId = props.parent_id || props.document_id;
  formData.parent_id = parentId;
  formData.is_dir = false;
  // 重置时也根据父级目录计算排序值
  const count = getChildrenCountByParentId(parentId);
  formData.sort = count + 1;
};

// 暴露方法给父组件
defineExpose({
  submit,
  resetFields,
  formData,
  updateSortValue,
});
</script>

<style lang="scss" scoped>
:deep(.ant-form-item) {
  margin-bottom: 16px;
}
</style>
