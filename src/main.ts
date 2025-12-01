import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import pinia from "@/store";
import "virtual:svg-icons-register";
import VueLazyLoad from "vue3-lazyload";
import { message } from "ant-design-vue";

// v-md-editor
import VMdEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
import hljs from "highlight.js";
import createTodoListPlugin from "@kangc/v-md-editor/lib/plugins/todo-list/index";
import "@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css";
import createMermaidPlugin from "@kangc/v-md-editor/lib/plugins/mermaid/npm";
import mermaid from "mermaid";
import "@kangc/v-md-editor/lib/plugins/mermaid/mermaid.css";
import createHighlightLinesPlugin from "@kangc/v-md-editor/lib/plugins/highlight-lines/index";
import "@kangc/v-md-editor/lib/plugins/highlight-lines/highlight-lines.css";
import createCopyCodePlugin from "@kangc/v-md-editor/lib/plugins/copy-code/index";
import "@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css";

VMdEditor.use(githubTheme, {
  Hljs: hljs,
});
VMdEditor.use(createTodoListPlugin());
VMdEditor.use(createMermaidPlugin({ mermaid }));
VMdEditor.use(createHighlightLinesPlugin());
VMdEditor.use(createCopyCodePlugin());

const app = createApp(App);
app.use(router).use(pinia).use(VueLazyLoad, {}).use(VMdEditor);

message.config({
  duration: 2,
  maxCount: 1,
  rtl: true,
});

app.mount("#app");
