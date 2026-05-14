// File: src/theme/themeConfig.ts
import type { ThemeConfig } from "antd";

const themeConfig: ThemeConfig = {
  token: {
    fontFamily: '"Inter", sans-serif',
    colorPrimary: "#2E7D32", // Primary Green cho các active states, buttons
    colorInfo: "#1976D2", // Secondary Blue
    colorError: "#D32F2F", // Danger
    colorTextBase: "#1b1c1c", // Deep charcoal
    colorBgBase: "#ffffff",
    colorBgLayout: "#F5F7FA", // Surface Level 0
    borderRadius: 4, // Soft shape 4px
    wireframe: false,
    colorBorderSecondary: "#E0E0E0", // 1px border cho Card
  },
  components: {
    Layout: {
      siderBg: "#1A1C1E", // Dark charcoal background cho Sidebar
      headerBg: "#ffffff",
    },
    Menu: {
      darkItemBg: "#1A1C1E",
      darkItemColor: "rgba(255, 255, 255, 0.65)",
      darkItemHoverColor: "#ffffff",
      darkItemSelectedBg: "rgba(46, 125, 50, 0.15)", // Nền xanh nhạt khi active
      darkItemSelectedColor: "#ffffff",
    },
    Button: {
      controlHeight: 36,
      borderRadius: 4,
    },
    Card: {
      colorBorderSecondary: "#E0E0E0",
    },
    Table: {
      headerBg: "#ECEFF1",
      headerColor: "#1b1c1c",
      borderRadius: 4,
    },
  },
};

export default themeConfig;
