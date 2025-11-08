import React from "react";

export function Textarea({ className = "", ...props }: any) {
  return (
    <textarea
      className={`border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 ${className}`}
      {...props}
    />
  );
}
