import { defineConfig } from "vite";
import livePreview from "vite-live-preview";

let WS_URI = process.env.WS_URI || "http://localhost:4402";
let MULTI_USER_MODE = process.env.MULTI_USER_MODE === "true";
const configuredAllowedHosts = (process.env.PENPOT_MCP_PLUGIN_ALLOWED_HOSTS || process.env.PENPOT_MCP_SERVER_ADDRESS || "")
    .split(",")
    .map((host) => host.trim())
    .filter(Boolean);
const pluginPublicHost = (() => {
    const pluginPublicUrl = process.env.PENPOT_MCP_PLUGIN_PUBLIC_URL;
    if (!pluginPublicUrl) {
        return "";
    }
    try {
        return new URL(pluginPublicUrl).hostname;
    } catch {
        return "";
    }
})();
let ALLOWED_HOSTS = Array.from(new Set([...configuredAllowedHosts, pluginPublicHost].filter(Boolean)));

console.log("Will define IS_MULTI_USER_MODE as:", JSON.stringify(MULTI_USER_MODE));
console.log("Will define PENPOT_MCP_WEBSOCKET_URL as:", JSON.stringify(WS_URI));
console.log("Will allow preview hosts:", JSON.stringify(ALLOWED_HOSTS));

export default defineConfig({
    base: "./",
    plugins: [
        livePreview({
            reload: true,
            config: {
                build: {
                    sourcemap: true,
                },
            },
        }),
    ],
    build: {
        rollupOptions: {
            input: {
                plugin: "src/plugin.ts",
                index: "./index.html",
            },
            output: {
                entryFileNames: "[name].js",
            },
        },
    },
    preview: {
        host: "0.0.0.0",
        port: 4400,
        cors: true,
        allowedHosts: ALLOWED_HOSTS,
    },
    define: {
        IS_MULTI_USER_MODE: JSON.stringify(process.env.MULTI_USER_MODE === "true"),
        PENPOT_MCP_WEBSOCKET_URL: JSON.stringify(WS_URI),
    },
});
