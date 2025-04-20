"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export function LoadingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // 添加路由事件监听
    document.addEventListener("next:router:start", handleStart);
    document.addEventListener("next:router:complete", handleComplete);
    document.addEventListener("next:router:error", handleComplete);

    return () => {
      // 移除监听器
      document.removeEventListener("next:router:start", handleStart);
      document.removeEventListener("next:router:complete", handleComplete);
      document.removeEventListener("next:router:error", handleComplete);
    };
  }, []);

  // 路径或查询参数变化时记录新的加载状态
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div className="h-full bg-primary animate-pulse"></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background/80 p-4 rounded-full shadow-lg z-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    </div>
  );
}
