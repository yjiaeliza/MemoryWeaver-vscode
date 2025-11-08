import express from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  console.log("✅ registerRoutes 被调用");

  // ✅ 确保后端能接收大图片（Base64 可能很长）
  app.use(express.json({ limit: "15mb" }));

  // ========= 智谱 AI 手帐描述路由 =========
  app.post("/api/caption", async (req, res) => {
    try {
      const { image } = req.body;

      // ✅ 调试输出，确认前端传来的格式
      console.log("📸 image 类型:", typeof image);
      console.log("📸 image 预览:", String(image).slice(0, 100));

      if (!image || typeof image !== "string") {
        return res.status(400).json({ error: "image is required (base64 string or URL)" });
      }

      // 判断是 URL 还是 Base64
      const isUrl = /^https?:\/\//i.test(image);
      let imageForAPI = image;

      // ✅ 如果是 Base64，就补上 data URI 头（智谱也能接受）
      if (!isUrl) {
        const hasHeader = /^data:image\/\w+;base64,/i.test(image);
        if (!hasHeader) {
          imageForAPI = `data:image/jpeg;base64,${image}`;
        }
      }

      console.log("🧠 准备发送给智谱的 image_url 预览:", imageForAPI.slice(0, 80));

      const response = await fetch("https://open.bigmodel.cn/api/paas/v4/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ZHIPUAI_API_KEY}`,
        },
        body: JSON.stringify({
  model: "glm-4v",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "请用温柔手帐风，不超过20个词，场景感，末尾配1个契合表情；参考用户备注。",
        },
        {
          type: "image_url",
          image_url: { url: imageForAPI }, // ✅ 改成对象
        },
      ],
    },
  ],
}),

      });

      const data = await response.json();

      if (!response.ok) {
        console.error("❌ 智谱 API 调用错误:", data);
        return res.status(500).json({ error: data });
      }

      const caption =
        data?.choices?.[0]?.message?.content ||
        data?.choices?.[0]?.content ||
        "暂时无法生成描述，请稍后再试。";

      console.log("✅ 智谱返回:", caption);

      res.json({ caption });
    } catch (err: any) {
      console.error("❌ caption 生成失败:", err);
      res.status(500).json({ error: err?.message || "生成失败" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
