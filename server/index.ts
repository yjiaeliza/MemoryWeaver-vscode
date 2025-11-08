// ============================
// 📘 MemoryWeaver 后端入口文件
// ============================

// 🧭 在 ESM 模块中重建 __dirname
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ 加载环境变量
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log("🔑 Loaded Key =", process.env.ZHIPUAI_API_KEY?.slice(0, 10) + "...");

import express from "express";
import type { Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.ts";
import cors from "cors";

console.log("✅ index.ts 已加载");

// =============== 环境配置 ===============
dotenv.config({ path: "/Users/zhangtiaotiao/Desktop/MemoryWeaver/.env" });

// =============== 初始化 Express ===============
const app = express();

// ✅ 启用跨域访问（允许前端 http://localhost:5173 调用）
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

// ✅ 启用 JSON 与 URL 编码解析
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ 打印每个 /api 请求的响应日志
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 120) logLine = logLine.slice(0, 119) + "…";
      console.log(logLine);
    }
  });

  next();
});

// =============== 启动主函数 ===============
async function startServer() {
  try {
    console.log("🚀 MemoryWeaver 后端启动中...");
    const server = await registerRoutes(app);

    // ✅ 全局错误捕获
    app.use(
      (err: any, _req: Request, res: Response, _next: NextFunction) => {
        const status = err.status || err.statusCode || 500;
        const message = err.message || "Internal Server Error";
        console.error("❌ Server Error:", message);
        res.status(status).json({ message });
      }
    );

    const port = parseInt(process.env.PORT || "3001", 10);
    server.listen(port, "127.0.0.1", () => {
      console.log("⚠️ 已跳过 Vite 集成，仅运行后端 API 服务。");
      console.log(`✅ Server running at http://127.0.0.1:${port}`);
    });
  } catch (err) {
    console.error("❌ 后端启动失败:", err);
  }
}

// ✅ 显式启动（避免立即调用 async 块在 Node24 下被忽略）
startServer();
