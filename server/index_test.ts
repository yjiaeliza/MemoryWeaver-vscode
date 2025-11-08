console.log("🧩 index_test.ts 启动中...");

(async () => {
  try {
    const mod = await import("./routes.ts");
    console.log("✅ routes.ts 成功导入:", Object.keys(mod));
  } catch (err) {
    console.error("❌ routes.ts 导入失败:", err);
  } finally {
    console.log("🧩 index_test.ts 结束");
  }
})();
