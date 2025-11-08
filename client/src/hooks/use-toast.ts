import React, { useState } from "react";

export interface ToastOptions {
  title?: string;
  description?: string | React.ReactNode; // ✅ 支持 JSX
  variant?: "default" | "destructive" | "success"; // ✅ 增加 variant 类型
  duration?: number;
}

// 这是一个简单的全局 toast hook 模拟（可替换成你自己的 UI 库实现）
export function useToast() {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  function toast(options: ToastOptions) {
    console.log("🔥 Toast:", options.title, options.description);
    setToasts((prev) => [...prev, options]);

    // 如果提供了 duration，则自动清除
    if (options.duration) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t !== options));
      }, options.duration);
    }
  }

  return { toast, toasts };
}
