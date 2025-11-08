import React from "react";

export function Card({ children, className = "" }: any) {
  return <div className={`rounded-xl border bg-white shadow-sm ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = "" }: any) {
  return <div className={`p-4 border-b ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: any) {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
}

export function CardDescription({ children, className = "" }: any) {
  return <p className={`text-sm text-gray-500 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }: any) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
