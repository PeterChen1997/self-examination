"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleNavStart = () => {
      setIsLoading(true);
    };

    const handleNavComplete = () => {
      setIsLoading(false);
    };

    window.addEventListener("NavigationStart", handleNavStart);
    window.addEventListener("NavigationComplete", handleNavComplete);

    // 在Next.js 14中，也可以用以下事件(取决于Next.js版本)
    window.addEventListener("navigationstart", handleNavStart);
    window.addEventListener("navigationend", handleNavComplete);

    return () => {
      window.removeEventListener("NavigationStart", handleNavStart);
      window.removeEventListener("NavigationComplete", handleNavComplete);
      window.removeEventListener("navigationstart", handleNavStart);
      window.removeEventListener("navigationend", handleNavComplete);
    };
  }, []);

  // 路径或搜索参数变化时关闭加载
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background shadow-lg rounded-lg p-4 flex items-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span>页面加载中...</span>
      </div>
    </div>
  );
}
