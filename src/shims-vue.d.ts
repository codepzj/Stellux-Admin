declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

// v-md-editor type declarations
declare module "@kangc/v-md-editor" {
  import { Plugin } from "vue";
  const VMdEditor: Plugin & {
    use: (theme: any, options?: any) => void;
  };
  export default VMdEditor;
}

declare module "@kangc/v-md-editor/lib/preview" {
  import { Plugin } from "vue";
  const VMdPreview: Plugin & {
    use: (theme: any, options?: any) => void;
  };
  export default VMdPreview;
}

declare module "@kangc/v-md-editor/lib/theme/github.js" {
  const githubTheme: any;
  export default githubTheme;
}

declare module "@kangc/v-md-editor/lib/plugins/todo-list/index" {
  const createTodoListPlugin: () => any;
  export default createTodoListPlugin;
}

declare module "@kangc/v-md-editor/lib/plugins/mermaid/npm" {
  const createMermaidPlugin: (options?: { mermaid: any }) => any;
  export default createMermaidPlugin;
}

declare module "@kangc/v-md-editor/lib/plugins/highlight-lines/index" {
  const createHighlightLinesPlugin: () => any;
  export default createHighlightLinesPlugin;
}

declare module "@kangc/v-md-editor/lib/plugins/copy-code/index" {
  const createCopyCodePlugin: () => any;
  export default createCopyCodePlugin;
}
