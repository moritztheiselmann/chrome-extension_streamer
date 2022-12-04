// vite.config.ts
import { defineConfig } from "file:///Users/mj/Documents/work/projects/duran-lantink_3d-poses/stream-tab-extension/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/mj/Documents/work/projects/duran-lantink_3d-poses/stream-tab-extension/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { crx } from "file:///Users/mj/Documents/work/projects/duran-lantink_3d-poses/stream-tab-extension/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// manifest.json
var manifest_default = {
  manifest_version: 3,
  name: "Stream Tab",
  description: "Stream tab to defined locaiton",
  version: "0.0.1",
  action: {
    default_popup: "index.html"
  },
  permissions: [
    "activeTab",
    "scripting",
    "desktopCapture"
  ],
  background: {
    scripts: "src/background.ts"
  }
};

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    crx({ manifest: manifest_default })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWovRG9jdW1lbnRzL3dvcmsvcHJvamVjdHMvZHVyYW4tbGFudGlua18zZC1wb3Nlcy9zdHJlYW0tdGFiLWV4dGVuc2lvblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21qL0RvY3VtZW50cy93b3JrL3Byb2plY3RzL2R1cmFuLWxhbnRpbmtfM2QtcG9zZXMvc3RyZWFtLXRhYi1leHRlbnNpb24vdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL21qL0RvY3VtZW50cy93b3JrL3Byb2plY3RzL2R1cmFuLWxhbnRpbmtfM2QtcG9zZXMvc3RyZWFtLXRhYi1leHRlbnNpb24vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5cbmltcG9ydCB7IGNyeCB9IGZyb20gJ0Bjcnhqcy92aXRlLXBsdWdpbidcbmltcG9ydCBtYW5pZmVzdCBmcm9tICcuL21hbmlmZXN0Lmpzb24nIC8vIE5vZGUgMTQgJiAxNlxuaW1wb3J0IG1hbmlmZXN0IGZyb20gJy4vbWFuaWZlc3QuanNvbicgYXNzZXJ0IHsgdHlwZTogJ2pzb24nIH0gLy8gTm9kZSA+PTE3XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgY3J4KHsgbWFuaWZlc3QgfSlcbiAgXVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeVosU0FBUyxvQkFBb0I7QUFDdGIsT0FBTyxTQUFTO0FBRWhCLFNBQVMsV0FBVzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtwQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixJQUFJLEVBQUUsMkJBQVMsQ0FBQztBQUFBLEVBQ2xCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
