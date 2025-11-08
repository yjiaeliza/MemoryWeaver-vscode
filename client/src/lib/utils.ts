// client/src/lib/utils.ts

/**
 * 拼接 className 的小工具函数（类似 clsx）
 * 用于组合 Tailwind 类名时去除 undefined/null/false
 */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
