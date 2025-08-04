import { theme } from "ant-design-vue";

export const useSystemStore = defineStore(
  "system",
  () => {
    const themeColor = ref("#1677FF");

    const appTheme = computed(() => {
      return {
        algorithm: theme.defaultAlgorithm,
        token: {
          fontSize: 14.5,
          colorPrimary: themeColor.value,
          fontFamily: "var(--font-sans)",
          motion: false,
        },
      };
    });

    const setThemeColor = (value: string) => {
      themeColor.value = value;
    };

    const ResetSystemStore = () => {
      themeColor.value = "#1677FF";
    };

    return {
      themeColor,
      setThemeColor,
      appTheme,
      ResetSystemStore,
    };
  },
  {
    persist: true,
  }
);
