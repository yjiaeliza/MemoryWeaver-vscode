import React from "react";

export function Input({ className = "", ...props }: any) {
  return (
    <input
      className={`border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 ${className}`}
      {...props}
    />
  );
}
