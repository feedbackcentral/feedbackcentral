import colors from "windicss/colors";
import { defineConfig } from "windicss/helpers";

export default defineConfig({
  shortcuts: {
    title: "text-3xl font-bold",
    subtitle: "text-xl",
  },
  extract: {
    include: ["**/*.{jsx,tsx,css}"],
    exclude: ["node_modules", ".git", ".next"],
  },
  theme: {
    extend: {
      colors: {
        primary: colors.indigo[300],
        accent: colors.gray[200],
      },
    },
  },
  plugins: [require("windicss/plugin/forms")],
});
