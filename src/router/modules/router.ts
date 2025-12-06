import {
  createWebHistory,
  createRouter,
  type RouteRecordRaw,
} from "vue-router";

import Layout from "@/layout/index.vue";
import Login from "@/views/auth/login.vue";

import { Icon } from "@iconify/vue";

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Layout,
    redirect: "/post/create",
    children: [
      {
        path: "/user",
        name: "UserManagement",
        meta: {
          title: "用户",
          icon: () => h(Icon, { icon: "uil:user", width: 18, height: 18 }),
        },
        redirect: { name: "UserList" },
        children: [
          {
            path: "list",
            component: () => import("@/views/user/list.vue"),
            name: "UserList",
            meta: { title: "用户列表" },
          },
          {
            path: "edit",
            name: "UserEdit",
            meta: { title: "编辑用户" },
            component: () => import("@/views/user/edit/index.vue"),
            redirect: { name: "UserEditBasic" },
            children: [
              {
                path: "basic",
                component: () => import("@/views/user/edit/pages/basic.vue"),
                name: "UserEditBasic",
                meta: { title: "基本信息", hideInSideBar: true },
              },
              {
                path: "reset-password",
                component: () =>
                  import("@/views/user/edit/pages/ResetPassword.vue"),
                name: "UserEditResetPassword",
                meta: { title: "重置密码", hideInSideBar: true },
              },
            ],
          },
        ],
      },
      {
        path: "/post",
        name: "Post",
        redirect: { name: "PostList" },
        meta: {
          title: "文章",
          icon: () =>
            h(Icon, {
              icon: "lineicons:write",
              width: 18,
              height: 18,
            }),
        },
        children: [
          {
            path: "create",
            component: () => import("@/views/post/create.vue"),
            name: "PostCreate",
            meta: {
              title: "发布文章",
              keepAlive: true,
            },
          },
          {
            path: "edit/:id",
            component: () => import("@/views/post/edit.vue"),
            name: "PostEdit",
            meta: {
              title: "编辑文章",
              hideInBreadcrumb: true,
              hideInSideBar: true,
            },
          },
          {
            path: "list",
            component: () => import("@/views/post/list.vue"),
            name: "PostList",
            meta: {
              title: "文章列表",
            },
          },
          {
            path: "label",
            name: "PostLabel",
            meta: { title: "文章标签" },
            component: () => import("@/views/label/index.vue"),
          },
        ],
      },
      {
        path: "/document",
        name: "Document",
        meta: {
          title: "文档",
          icon: () => h(Icon, { icon: "fe:document", width: 18, height: 18 }),
        },
        redirect: { name: "DocumentOverview" },
        children: [
          {
            path: "overview",
            name: "DocumentOverview",
            component: () => import("@/views/document/overview.vue"),
            meta: {
              title: "列表页",
            },
          },
          {
            path: "bin",
            name: "DocumentBin",
            component: () => import("@/views/document/bin.vue"),
            meta: {
              title: "回收箱",
            },
          },
        ],
      },
      {
        path: "/friend",
        name: "Friend",
        meta: {
          title: "友链",
          icon: () =>
            h(Icon, {
              icon: "icon-park-outline:friends-circle",
              width: 18,
              height: 18,
            }),
        },
        component: () => import("@/views/friend/index.vue"),
      },
      {
        path: "/file",
        name: "File",
        meta: {
          title: "附件",
          icon: () =>
            h(Icon, { icon: "octicon:upload-16", width: 18, height: 18 }),
        },
        component: () => import("@/views/file/index.vue"),
      },
      {
        path: "/config",
        name: "Config",
        meta: {
          title: "设置",
          icon: () =>
            h(Icon, {
              icon: "icon-park-outline:setting",
              width: 18,
              height: 18,
            }),
        },
        component: () => import("@/views/page/index.vue"),
      },
    ],
  },
  {
    path: "/document/content",
    name: "DocumentContent",
    component: () => import("@/views/document/index.vue"),
    children: [
      {
        path: ":id",
        name: "DocumentContentDetail",
        component: () => import("@/views/document/content.vue"),
        meta: {
          keepAlive: true,
          title: "文档内容",
        },
      },
    ],
  },
  {
    path: "/login",
    component: Login,
    name: "Login",
  },
  {
    path: "/error",
    redirect: { name: "404" },
    children: ["401", "403", "404", "500"].map(code => {
      return {
        path: code,
        name: code,
        component: () => import(`@/views/auth/error.vue`),
      };
    }),
  },
  {
    path: "/:pathMatch(.*)",
    redirect: { name: "404" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function getCacheNames(routes: RouteRecordRaw[]): string[] {
  return routes.reduce((names: string[], route) => {
    if (route.meta?.keepAlive) {
      names.push(route.name as string);
    }
    if (route.children) {
      names.push(...getCacheNames(route.children));
    }
    return names;
  }, []);
}

export const cacheNames = getCacheNames(routes);

export default router;
