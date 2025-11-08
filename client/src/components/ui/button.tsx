// client/src/components/ui/button.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 通用按钮组件
 * 支持 className 自定义与渐变 hover
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "md", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      default: "bg-[#8b5e3c] text-white hover:bg-[#7a5235]",
      outline: "border border-[#8b5e3c] text-[#8b5e3c] hover:bg-[#f5f1e8]",
      ghost: "text-[#8b5e3c] hover:bg-[#f3ebe3]",
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
