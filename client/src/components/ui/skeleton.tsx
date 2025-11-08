import React from "react";

export function Skeleton({ className = "" }: any) {
  return <div className={`bg-gray-200 animate-pulse rounded-md ${className}`} />;
}
