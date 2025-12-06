<template>
  <a-modal
    v-model:open="visible"
    :title="isEdit ? '编辑网站设置' : '新建网站设置'"
    width="800px"
    :mask-closable="false"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical">
      <!-- 基础信息 -->
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="设置类型" name="type">
            <a-select
              v-model:value="formData.type"
              placeholder="请选择设置类型"
              :disabled="isEdit"
            >
              <a-select-option
                value="home"
                :disabled="!isEdit && existingConfigTypes.includes('home')"
              >
                主页设置
                <span
                  v-if="!isEdit && existingConfigTypes.includes('home')"
                  class="text-gray-400 ml-2"
                  >(已创建)</span
                >
              </a-select-option>
              <a-select-option
                value="about"
                :disabled="!isEdit && existingConfigTypes.includes('about')"
              >
                关于页设置
                <span
                  v-if="!isEdit && existingConfigTypes.includes('about')"
                  class="text-gray-400 ml-2"
                  >(已创建)</span
                >
              </a-select-option>
              <a-select-option
                value="seo"
                :disabled="!isEdit && existingConfigTypes.includes('seo')"
              >
                SEO设置
                <span
                  v-if="!isEdit && existingConfigTypes.includes('seo')"
                  class="text-gray-400 ml-2"
                  >(已创建)</span
                >
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 通用配置 -->
      <a-divider>通用配置</a-divider>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item
            label="标题"
            name="title"
            :rules="[{ max: 100, message: '标题不能超过100个字符' }]"
          >
            <a-input
              v-model:value="formData.content.title"
              placeholder="请输入页面标题"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="描述"
            name="description"
            :rules="[{ max: 200, message: '描述不能超过200个字符' }]"
          >
            <a-input
              v-model:value="formData.content.description"
              placeholder="请输入页面描述"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <!-- 主页配置 -->
      <template v-if="formData.type === 'home'">
        <a-divider>主页信息</a-divider>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              label="头像URL"
              name="avatar"
              :rules="[{ type: 'url', message: '请输入有效的URL地址' }]"
            >
              <a-input
                v-model:value="formData.content.avatar"
                placeholder="请输入头像URL"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="姓名"
              name="name"
              :rules="[{ max: 50, message: '姓名不能超过50个字符' }]"
            >
              <a-input
                v-model:value="formData.content.name"
                placeholder="请输入姓名"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              label="个人简介"
              name="bio"
              :rules="[{ max: 200, message: '个人简介不能超过200个字符' }]"
            >
              <a-textarea
                v-model:value="formData.content.bio"
                placeholder="请输入个人简介"
                :rows="3"
                show-count
                :maxlength="200"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="名言"
              name="quote"
              :rules="[{ max: 100, message: '名言不能超过100个字符' }]"
            >
              <a-input
                v-model:value="formData.content.quote"
                placeholder="请输入名言"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              label="GitHub地址"
              name="github"
              :rules="[{ type: 'url', message: '请输入有效的GitHub地址' }]"
            >
              <a-input
                v-model:value="formData.content.github"
                placeholder="请输入GitHub地址"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="博客地址"
              name="blog"
              :rules="[{ type: 'url', message: '请输入有效的博客地址' }]"
            >
              <a-input
                v-model:value="formData.content.blog"
                placeholder="请输入博客地址"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="位置" name="location">
              <a-input
                v-model:value="formData.content.location"
                placeholder="请输入位置"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="显示最近文章" name="show_recent_posts">
              <a-switch
                v-model:checked="formData.content.show_recent_posts"
                checked-children="显示"
                un-checked-children="隐藏"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item
          v-if="formData.content.show_recent_posts"
          label="最近文章数量"
          name="recent_posts_count"
        >
          <a-input-number
            v-model:value="formData.content.recent_posts_count"
            :min="1"
            :max="10"
            placeholder="请输入数量"
          />
        </a-form-item>

        <a-form-item label="技术栈" name="tech_stacks">
          <a-select
            v-model:value="formData.content.tech_stacks"
            mode="tags"
            placeholder="请输入技术栈，按回车添加"
            :token-separators="[';']"
          />
        </a-form-item>

        <a-form-item label="开源项目">
          <a-button type="dashed" block @click="addRepository">
            <template #icon>
              <PlusOutlined />
            </template>
            添加项目
          </a-button>
          <div
            v-for="(repo, index) in formData.content.repositories || []"
            :key="index"
            class="repo-item"
          >
            <a-row :gutter="8" align="middle">
              <a-col :span="7">
                <a-input
                  v-model:value="repo.name"
                  placeholder="项目名称"
                  size="small"
                />
              </a-col>
              <a-col :span="11">
                <a-input
                  v-model:value="repo.url"
                  placeholder="项目地址"
                  size="small"
                />
              </a-col>
              <a-col :span="5">
                <a-input
                  v-model:value="repo.desc"
                  placeholder="项目描述"
                  size="small"
                />
              </a-col>
              <a-col :span="1">
                <a-button
                  type="text"
                  danger
                  size="small"
                  @click="removeRepository(index)"
                >
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </a-button>
              </a-col>
            </a-row>
          </div>
        </a-form-item>
      </template>

      <!-- About页面配置 -->
      <template v-if="formData.type === 'about'">
        <a-divider>关于页信息</a-divider>

        <a-form-item label="技能">
          <a-button type="dashed" block @click="addSkill">
            <template #icon>
              <PlusOutlined />
            </template>
            添加技能分类
          </a-button>
          <div
            v-for="(skill, index) in formData.content.skills || []"
            :key="index"
            class="skill-item"
          >
            <a-row :gutter="8" align="middle">
              <a-col :span="6">
                <a-input
                  v-model:value="skill.category"
                  placeholder="分类名称"
                  size="small"
                />
              </a-col>
              <a-col :span="17">
                <a-select
                  v-model:value="skill.items"
                  mode="tags"
                  placeholder="技能列表"
                  size="small"
                  :token-separators="[';']"
                />
              </a-col>
              <a-col :span="1">
                <a-button
                  type="text"
                  danger
                  size="small"
                  @click="removeSkill(index)"
                >
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </a-button>
              </a-col>
            </a-row>
          </div>
        </a-form-item>

        <a-form-item label="时间线">
          <a-button type="dashed" block @click="addTimeline">
            <template #icon>
              <PlusOutlined />
            </template>
            添加时间线项目
          </a-button>
          <div
            v-for="(item, index) in formData.content.timeline || []"
            :key="index"
            class="timeline-item"
          >
            <a-row :gutter="8" align="middle">
              <a-col :span="5">
                <a-input
                  v-model:value="item.year"
                  placeholder="年份"
                  size="small"
                />
              </a-col>
              <a-col :span="6">
                <a-input
                  v-model:value="item.title"
                  placeholder="标题"
                  size="small"
                />
              </a-col>
              <a-col :span="12">
                <a-input
                  v-model:value="item.desc"
                  placeholder="描述"
                  size="small"
                />
              </a-col>
              <a-col :span="1">
                <a-button
                  type="text"
                  danger
                  size="small"
                  @click="removeTimeline(index)"
                >
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </a-button>
              </a-col>
            </a-row>
          </div>
        </a-form-item>

        <a-form-item label="兴趣爱好" name="interests">
          <a-select
            v-model:value="formData.content.interests"
            mode="tags"
            placeholder="请输入兴趣爱好，按回车添加"
            :token-separators="[';']"
          />
        </a-form-item>

        <a-form-item label="当前专注">
          <a-button type="dashed" block @click="addFocusItem">
            <template #icon>
              <PlusOutlined />
            </template>
            添加专注事项
          </a-button>
          <div
            v-for="(_item, index) in formData.content.focus_items || []"
            :key="index"
            class="focus-item"
          >
            <a-row :gutter="8" align="middle">
              <a-col :span="22">
                <a-input
                  v-model:value="formData.content.focus_items![index]"
                  placeholder="专注事项"
                  size="small"
                />
              </a-col>
              <a-col :span="2">
                <a-button
                  type="text"
                  danger
                  size="small"
                  @click="removeFocusItem(index)"
                >
                  <template #icon>
                    <DeleteOutlined />
                  </template>
                </a-button>
              </a-col>
            </a-row>
          </div>
        </a-form-item>
      </template>

      <!-- SEO配置 -->
      <template v-if="formData.type === 'seo'">
        <a-divider>SEO配置</a-divider>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item
              label="SEO标题"
              name="seo_title"
              :rules="[
                { required: true, message: '请输入SEO标题' },
                { max: 60, message: 'SEO标题不能超过60个字符' },
              ]"
            >
              <a-input
                v-model:value="formData.content.seo_title"
                placeholder="请输入SEO标题（建议30-60个字符）"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="SEO关键词" name="seo_keywords">
              <a-select
                v-model:value="formData.content.seo_keywords"
                mode="tags"
                placeholder="请输入关键词，按回车添加"
                :token-separators="[';']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="Canonical URL"
              name="canonical_url"
              :rules="[{ type: 'url', message: '请输入有效的规范URL' }]"
            >
              <a-input
                v-model:value="formData.content.canonical_url"
                placeholder="请输入规范URL"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item
              label="SEO描述"
              name="seo_description"
              :rules="[
                { required: true, message: '请输入SEO描述' },
                { max: 160, message: 'SEO描述不能超过160个字符' },
              ]"
            >
              <a-textarea
                v-model:value="formData.content.seo_description"
                placeholder="请输入SEO描述（建议120-160个字符）"
                :rows="3"
                show-count
                :maxlength="160"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider>Open Graph</a-divider>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item
              label="OG标题"
              name="og_title"
              :rules="[{ max: 60, message: 'Open Graph标题不能超过60个字符' }]"
            >
              <a-input
                v-model:value="formData.content.og_title"
                placeholder="请输入Open Graph标题"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Twitter Card类型" name="twitter_card">
              <a-select
                v-model:value="formData.content.twitter_card"
                placeholder="请选择Twitter Card类型"
              >
                <a-select-option value="summary">Summary</a-select-option>
                <a-select-option value="summary_large_image"
                  >Summary Large Image</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item
              label="OG描述"
              name="og_description"
              :rules="[
                { max: 160, message: 'Open Graph描述不能超过160个字符' },
              ]"
            >
              <a-textarea
                v-model:value="formData.content.og_description"
                placeholder="请输入Open Graph描述"
                :rows="3"
                show-count
                :maxlength="160"
              />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="24">
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-600 whitespace-nowrap"
                >OG图片：</span
              >
              <a-input
                v-model:value="formData.content.og_image"
                placeholder="输入图片链接或从相册选择"
                style="flex: 1"
              />
              <a-button
                type="link"
                size="small"
                @click="openPhotoModal('og_image')"
              >
                <template #icon>
                  <Icon icon="solar:gallery-bold-duotone" />
                </template>
                从相册选择
              </a-button>
            </div>
          </a-col>
        </a-row>

        <a-divider>其他设置</a-divider>

        <a-row :gutter="16">
          <a-col :span="24">
            <a-form-item label="Robots Meta" name="robots_meta">
              <a-select
                v-model:value="formData.content.robots_meta"
                placeholder="请选择Robots指令"
              >
                <a-select-option value="index,follow"
                  >index,follow</a-select-option
                >
                <a-select-option value="noindex,follow"
                  >noindex,follow</a-select-option
                >
                <a-select-option value="index,nofollow"
                  >index,nofollow</a-select-option
                >
                <a-select-option value="noindex,nofollow"
                  >noindex,nofollow</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </template>
    </a-form>

    <!-- 图片选择弹窗 -->
    <PhotoSelect
      v-model:open="photoSelectOpen"
      @selected-picture="handleSelectedPicture"
    />
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick, computed } from "vue";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons-vue";
import { Icon } from "@iconify/vue";
import PhotoSelect from "@/components/PhotoSelect/index.vue";
import type { ConfigReq, Content } from "@/types/config";

interface Props {
  open: boolean;
  config?: any;
  loading?: boolean;
  existingConfigs?: any[];
}

interface Emits {
  (e: "update:open", value: boolean): void;
  (e: "ok", config: ConfigReq): void;
  (e: "cancel"): void;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  config: null,
  loading: false,
  existingConfigs: () => [],
});

const emit = defineEmits<Emits>();

const visible = ref(false);
const formRef = ref();
const isEdit = ref(false);
const photoSelectOpen = ref(false);
const currentPhotoField = ref<string>("");

const formData = reactive<ConfigReq>({
  type: "home",
  content: {
    title: "",
    description: "",
  } as Content,
});

// 已存在的配置类型列表
const existingConfigTypes = computed(() => {
  return props.existingConfigs?.map(config => config.type) || [];
});

const rules = {
  type: [{ required: true, message: "请选择页面类型" }],
  content: [
    {
      validator: (_rule: any, value: any) => {
        // 通用验证 - 标题和描述的必填校验
        if (!value) {
          return Promise.reject("页面内容不能为空");
        }
        if (!value.title || value.title.trim() === "") {
          return Promise.reject("请输入标题");
        }
        if (!value.description || value.description.trim() === "") {
          return Promise.reject("请输入描述");
        }

        // 根据配置类型进行特有验证
        const configType = formData.value.type;

        if (configType === "home") {
          // 主页配置验证
          if (value.name && value.name.trim().length > 50) {
            return Promise.reject("姓名不能超过50个字符");
          }
          if (value.bio && value.bio.trim().length > 200) {
            return Promise.reject("个人简介不能超过200个字符");
          }
          if (value.quote && value.quote.trim().length > 100) {
            return Promise.reject("名言不能超过100个字符");
          }

          // URL格式验证
          if (value.avatar && !isValidUrl(value.avatar)) {
            return Promise.reject("头像URL格式不正确");
          }
          if (value.github && !isValidUrl(value.github)) {
            return Promise.reject("GitHub地址格式不正确");
          }
          if (value.blog && !isValidUrl(value.blog)) {
            return Promise.reject("博客地址格式不正确");
          }

          // 技术栈验证
          if (value.tech_stacks && value.tech_stacks.length > 20) {
            return Promise.reject("技术栈数量不能超过20个");
          }

          // 开源项目验证
          if (value.repositories) {
            for (let i = 0; i < value.repositories.length; i++) {
              const repo = value.repositories[i];
              if (!repo.name || repo.name.trim() === "") {
                return Promise.reject(`第${i + 1}个开源项目的名称不能为空`);
              }
              if (!repo.url || !isValidUrl(repo.url)) {
                return Promise.reject(`第${i + 1}个开源项目的地址格式不正确`);
              }
              if (repo.name.length > 50) {
                return Promise.reject(
                  `第${i + 1}个开源项目的名称不能超过50个字符`
                );
              }
              if (repo.desc && repo.desc.length > 100) {
                return Promise.reject(
                  `第${i + 1}个开源项目的描述不能超过100个字符`
                );
              }
            }
          }

          // 文章数量验证
          if (
            value.recent_posts_count &&
            (value.recent_posts_count < 1 || value.recent_posts_count > 10)
          ) {
            return Promise.reject("最近文章数量必须在1-10之间");
          }
        } else if (configType === "about") {
          // 关于页配置验证
          if (value.interests && value.interests.length > 15) {
            return Promise.reject("兴趣爱好数量不能超过15个");
          }

          // 技能验证
          if (value.skills) {
            for (let i = 0; i < value.skills.length; i++) {
              const skill = value.skills[i];
              if (!skill.category || skill.category.trim() === "") {
                return Promise.reject(`第${i + 1}个技能分类的名称不能为空`);
              }
              if (skill.category.length > 30) {
                return Promise.reject(
                  `第${i + 1}个技能分类的名称不能超过30个字符`
                );
              }
              if (!skill.items || skill.items.length === 0) {
                return Promise.reject(
                  `第${i + 1}个技能分类必须至少包含一个技能`
                );
              }
              if (skill.items.length > 10) {
                return Promise.reject(
                  `第${i + 1}个技能分类的技能数量不能超过10个`
                );
              }
            }
          }

          // 时间线验证
          if (value.timeline) {
            for (let i = 0; i < value.timeline.length; i++) {
              const item = value.timeline[i];
              if (!item.year || item.year.trim() === "") {
                return Promise.reject(`第${i + 1}个时间线项目的年份不能为空`);
              }
              if (!item.title || item.title.trim() === "") {
                return Promise.reject(`第${i + 1}个时间线项目的标题不能为空`);
              }
              if (item.title.length > 50) {
                return Promise.reject(
                  `第${i + 1}个时间线项目的标题不能超过50个字符`
                );
              }
              if (item.desc && item.desc.length > 200) {
                return Promise.reject(
                  `第${i + 1}个时间线项目的描述不能超过200个字符`
                );
              }
            }
          }

          // 专注事项验证
          if (value.focus_items) {
            for (let i = 0; i < value.focus_items.length; i++) {
              const item = value.focus_items[i];
              if (!item || item.trim() === "") {
                return Promise.reject(`第${i + 1}个专注事项不能为空`);
              }
              if (item.length > 100) {
                return Promise.reject(`第${i + 1}个专注事项不能超过100个字符`);
              }
            }
          }
        } else if (configType === "seo") {
          // SEO配置验证
          if (!value.seo_title || value.seo_title.trim() === "") {
            return Promise.reject("请输入SEO标题");
          }
          if (!value.seo_description || value.seo_description.trim() === "") {
            return Promise.reject("请输入SEO描述");
          }

          // 长度验证
          if (value.seo_title.length > 60) {
            return Promise.reject("SEO标题不能超过60个字符");
          }
          if (value.seo_description.length > 160) {
            return Promise.reject("SEO描述不能超过160个字符");
          }

          // 关键词验证
          if (value.seo_keywords && value.seo_keywords.length > 10) {
            return Promise.reject("SEO关键词数量不能超过10个");
          }
          if (value.seo_keywords) {
            for (let i = 0; i < value.seo_keywords.length; i++) {
              const keyword = value.seo_keywords[i];
              if (!keyword || keyword.trim() === "") {
                return Promise.reject(`第${i + 1}个关键词不能为空`);
              }
              if (keyword.length > 20) {
                return Promise.reject(`第${i + 1}个关键词不能超过20个字符`);
              }
            }
          }

          // URL格式验证
          if (value.canonical_url && !isValidUrl(value.canonical_url)) {
            return Promise.reject("规范URL格式不正确");
          }
          if (value.og_image && !isValidUrl(value.og_image)) {
            return Promise.reject("Open Graph图片URL格式不正确");
          }

          // Open Graph验证
          if (value.og_title && value.og_title.length > 60) {
            return Promise.reject("Open Graph标题不能超过60个字符");
          }
          if (value.og_description && value.og_description.length > 160) {
            return Promise.reject("Open Graph描述不能超过160个字符");
          }
        }

        return Promise.resolve();
      },
    },
  ],
};

// URL格式验证函数
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 监听visible变化
watch(
  () => props.open,
  newVal => {
    visible.value = newVal;
    if (newVal) {
      if (props.config) {
        isEdit.value = true;
        // 复制配置数据
        Object.assign(formData, props.config);
      } else {
        isEdit.value = false;
        // 选择第一个可用的配置类型
        const availableTypes = ["home", "about", "seo"].filter(
          type => !existingConfigTypes.value.includes(type)
        );
        const defaultType =
          availableTypes.length > 0 ? availableTypes[0] : "home";

        // 重置表单
        Object.assign(formData, {
          type: defaultType,
          content: {
            title: "",
            description: "",
          },
        });
      }
      nextTick(() => {
        formRef.value?.clearValidate();
      });
    }
  }
);

// 监听visible变化，同步给父组件
watch(visible, newVal => {
  emit("update:open", newVal);
});

// 添加开源项目
const addRepository = () => {
  if (!formData.content.repositories) {
    formData.content.repositories = [];
  }
  formData.content.repositories.push({
    name: "",
    url: "",
    desc: "",
  });
};

// 删除开源项目
const removeRepository = (index: number) => {
  formData.content.repositories?.splice(index, 1);
};

// 添加技能
const addSkill = () => {
  if (!formData.content.skills) {
    formData.content.skills = [];
  }
  formData.content.skills.push({
    category: "",
    items: [],
  });
};

// 删除技能
const removeSkill = (index: number) => {
  formData.content.skills?.splice(index, 1);
};

// 添加时间线项目
const addTimeline = () => {
  if (!formData.content.timeline) {
    formData.content.timeline = [];
  }
  formData.content.timeline.push({
    year: "",
    title: "",
    desc: "",
  });
};

// 删除时间线项目
const removeTimeline = (index: number) => {
  formData.content.timeline?.splice(index, 1);
};

// 添加专注事项
const addFocusItem = () => {
  if (!formData.content.focus_items) {
    formData.content.focus_items = [];
  }
  formData.content.focus_items.push("");
};

// 删除专注事项
const removeFocusItem = (index: number) => {
  formData.content.focus_items?.splice(index, 1);
};

// 确定
const handleOk = async () => {
  try {
    await formRef.value?.validate();
    emit("ok", { ...formData });
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 打开图片选择模态框
const openPhotoModal = (field: string) => {
  currentPhotoField.value = field;
  photoSelectOpen.value = true;
};

// 处理选择的图片
const handleSelectedPicture = (picture: string) => {
  if (!picture || !currentPhotoField.value) return;

  if (currentPhotoField.value === "og_image") {
    formData.content.og_image = picture;
  }
  currentPhotoField.value = "";
};

// 取消
const handleCancel = () => {
  emit("cancel");
};
</script>

<style scoped>
.repo-item,
.skill-item,
.timeline-item,
.focus-item {
  margin-bottom: 8px;
  padding: 8px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}
</style>
