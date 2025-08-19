<template>
  <div class="flex flex-col gap-4">
    <a-page-header
      :title="$route.meta.title"
      class="!px-0"
      @back="() => $router.back()"
      :backIcon="props.type !== 'publish' ? backIcon : false"
    >
      <template #extra>
        <a-input-search
          v-model:value="pageParam.keyword"
          placeholder="搜索标题 / 描述 / 标签"
          style="width: 240px"
          :loading="searchLoading"
          enter-button
          @search="onSearch"
        />
      </template>

      <div class="flex justify-between items-center mt-2">
        <div class="flex items-center gap-2">
          <a-popconfirm
            title="确定删除？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="onHandleDeleteSelected"
            :disabled="!selectedIdList.length"
          >
            <a-button type="primary" danger :disabled="!selectedIdList.length">
              <template #icon><DeleteOutlined /></template>
              删除
            </a-button>
          </a-popconfirm>

          <a-popconfirm
            v-if="props.type === 'bin'"
            title="确定恢复？"
            ok-text="确定"
            cancel-text="取消"
            @confirm="onHandleRestoreSelected"
            :disabled="!selectedIdList.length"
          >
            <a-button type="primary" :disabled="!selectedIdList.length">
              <template #icon><UndoOutlined /></template>
              恢复
            </a-button>
          </a-popconfirm>
        </div>

        <div class="flex gap-2">
          <a-button
            v-if="props.type !== 'publish'"
            type="primary"
            @click="
              $router.push({ name: 'PostList', query: { type: 'publish' } })
            "
          >
            已发布
          </a-button>
          <a-button
            v-if="props.type !== 'bin'"
            @click="$router.push({ name: 'PostList', query: { type: 'bin' } })"
          >
            回收站
          </a-button>
          <a-button
            v-if="props.type !== 'draft'"
            @click="
              $router.push({ name: 'PostList', query: { type: 'draft' } })
            "
          >
            草稿箱
          </a-button>
        </div>
      </div>
    </a-page-header>

    <a-table
      :columns="columns"
      :data-source="postList"
      :scroll="{ x: 1000 }"
      :pagination="false"
      :loading="loading"
      :rowKey="(record: PostDetailVO) => record.id"
      :rowSelection="rowSelection"
      class="mt-4"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <div class="text-sm font-medium flex items-center gap-2">
            {{ record.title }}
            <a-tag v-if="record.is_top" color="red">置顶</a-tag>
          </div>
        </template>

        <template v-else-if="column.key === 'description'">
          <span class="text-sm text-gray-500 line-clamp-2">
            {{ record.description }}
          </span>
        </template>

        <template v-else-if="column.key === 'thumbnail'">
          <a-image
            :width="80"
            :src="record.thumbnail"
            :fallback="ImgFallback"
          />
        </template>

        <template v-else-if="column.key === 'category'">
          <a-tag>{{ record.category }}</a-tag>
        </template>

        <template v-else-if="column.key === 'tags'">
          <div class="flex flex-wrap gap-1">
            <a-tag v-for="tag in record.tags" :key="tag">{{ tag }}</a-tag>
          </div>
        </template>

        <template v-else-if="column.key === 'action'">
          <div class="flex gap-1">
            <template v-if="props.type !== 'bin'">
              <a-button
                type="link"
                size="small"
                @click="() => onHandlePublish(record.id)"
              >
                {{ props.type === "publish" ? "设为草稿" : "发布文章" }}
              </a-button>
              <a-button
                type="link"
                size="small"
                @click="() => onHandleEdit(record)"
              >
                编辑
              </a-button>
              <a-popconfirm
                placement="bottomRight"
                title="确定删除该文章吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="() => onHandleSoftDelete(record)"
              >
                <a-button type="link" size="small" danger>删除</a-button>
              </a-popconfirm>
            </template>
            <template v-else>
              <a-button
                type="link"
                size="small"
                @click="() => onHandleRestore(record.id)"
              >
                恢复
              </a-button>
              <a-popconfirm
                placement="bottomRight"
                title="永久删除该文章？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="() => onHandleDelete(record)"
              >
                <a-button type="link" size="small" danger>删除</a-button>
              </a-popconfirm>
            </template>
          </div>
        </template>
      </template>
    </a-table>
    <div class="flex justify-end !my-4">
      <a-pagination
        v-model:current="pageParam.page_no"
        :total="totalCount"
        :page-size="pageParam.page_size"
        :page-size-options="pageSizeOptions"
        @change="onPageSizeChange"
        show-size-changer
      >
        <template #buildOptionText="props">
          <span>{{ props.value }}条/页</span>
        </template>
      </a-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  getPublishPostDetailListAPI,
  getDraftPostDetailListAPI,
  getBinPostDetailListAPI,
  softDeletePostAPI,
  updatePostPublishStatusAPI,
  restorePostAPI,
  deletePostAPI,
  softDeletePostBatchAPI,
  deletePostBatchAPI,
  restorePostBatchAPI,
} from "@/api/post";
import type { PostDetailVO } from "@/types/post";
import ImgFallback from "@/assets/png/img-fallback.png";
import { message, type TableColumnType, type TableProps } from "ant-design-vue";
import {
  DeleteOutlined,
  UndoOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons-vue";
import type { Key } from "ant-design-vue/es/table/interface";
import type { PageResponse, PageReq } from "@/types/dto";

const loading = ref(false);
const searchLoading = ref(false);
const postList = ref<PostDetailVO[]>([]);
const router = useRouter();

const props = defineProps<{
  type: "publish" | "draft" | "bin";
}>();

const pageSizeOptions = ref<string[]>(["10", "20", "30", "40", "50"]);
const pageParam = reactive<PageReq>({
  page_no: 1,
  page_size: 10,
  keyword: "",
});
const totalCount = ref(1);

const backIcon = h(ArrowLeftOutlined);

const selectedIdList = ref<string[]>([]);
const rowSelection: TableProps<PostDetailVO>["rowSelection"] = {
  onChange: (_keys: Key[], selectedRows) => {
    selectedIdList.value = selectedRows.map(row => row.id);
  },
};

const getPostList = async () => {
  loading.value = true;
  try {
    let res: PageResponse<PostDetailVO>;
    switch (props.type) {
      case "publish":
        res = await getPublishPostDetailListAPI(pageParam);
        break;
      case "draft":
        res = await getDraftPostDetailListAPI(pageParam);
        break;
      case "bin":
        res = await getBinPostDetailListAPI(pageParam);
        break;
    }
    postList.value = res.data.list;
    totalCount.value = res.data.total_count;
  } finally {
    loading.value = false;
  }
};

const onHandlePublish = async (id: string) => {
  await updatePostPublishStatusAPI(id, props.type !== "publish");
  message.success(props.type === "publish" ? "设为草稿成功" : "发布文章成功");
  await getPostList();
};

const onHandleRestore = async (id: string) => {
  await restorePostAPI(id);
  message.success("恢复成功，请到草稿箱查看");
  await getPostList();
};

const onHandleDeleteSelected = async () => {
  if (!selectedIdList.value.length) return;
  if (props.type === "bin") {
    await deletePostBatchAPI(selectedIdList.value);
  } else {
    await softDeletePostBatchAPI(selectedIdList.value);
  }
  message.success("批量操作成功");
  selectedIdList.value = [];
  await getPostList();
};

const onHandleRestoreSelected = async () => {
  if (!selectedIdList.value.length) return;
  await restorePostBatchAPI(selectedIdList.value);
  message.success("批量恢复成功");
  selectedIdList.value = [];
  await getPostList();
};

const onSearch = async () => {
  searchLoading.value = true;
  pageParam.page_no = 1;
  await getPostList();
  searchLoading.value = false;
};

const onHandleEdit = (record: PostDetailVO) => {
  router.push({ name: "PostEdit", params: { id: record.id } });
};

const onHandleSoftDelete = async (record: PostDetailVO) => {
  await softDeletePostAPI(record.id);
  message.success("删除成功");
  await getPostList();
};

const onHandleDelete = async (record: PostDetailVO) => {
  await deletePostAPI(record.id);
  message.success("已永久删除");
  await getPostList();
};

const onPageSizeChange = async (_page: number, pageSize: number) => {
  pageParam.page_no = 1;
  pageParam.page_size = pageSize;
  await getPostList();
};

const columns: TableColumnType<PostDetailVO>[] = [
  { title: "标题", key: "title", width: 200 },
  { title: "封面", key: "thumbnail", width: 100 },
  { title: "描述", key: "description", width: 220 },
  { title: "分类", key: "category", width: 100 },
  { title: "标签", key: "tags", width: 200 },
  { title: "操作", key: "action", width: 180, fixed: "right" },
];

// 监听类型变化, 重新获取文章列表
watch(
  () => props.type,
  () => {
    getPostList();
  },
  { immediate: true }
);
</script>

<style scoped lang="scss"></style>
