// server/vite.ts
// ⚠️ 精简版：仅提供日志功能，禁用所有 Vite 逻辑

export function log(message: string) {
  const time = new Date().toISOString().slice(11, 19);
  console.log(`[${time}] ${message}`);
}

// 💤 占位函数，避免被其他文件引用时报错
export async function setupVite() {
  console.warn("⚠️ setupVite 已禁用。");
}

export function serveStatic() {
  console.warn("⚠️ serveStatic 已禁用。");
}
