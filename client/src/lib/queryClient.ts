// src/lib/queryClient.ts
import { QueryClient } from "@tanstack/react-query";

/**
 * ✅ 初始化 React Query 客户端
 * 用于全局缓存管理（例如 API 数据、请求状态等）
 */
export const queryClient = new QueryClient();

/**
 * ✅ 模拟一个通用的 API 请求函数
 * （即使你暂时还没后端，也能用这个函数避免错误）
 */
export async function apiRequest<T>(
  method: string,
  url: string,
  body?: any
): Promise<T> {
  console.log(`[Mock API] ${method} ${url}`, body);
  // 这里返回一个泛型空对象，以避免类型报错
  return {} as T;
}
