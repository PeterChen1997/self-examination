"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export function GlobalLoadingIndicator() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const startLoading = () => {
      // 设置短暂延迟，避免快速导航闪烁
      timeout = setTimeout(() => setIsLoading(true), 100);
    };

    const stopLoading = () => {
      clearTimeout(timeout);
      setIsLoading(false);
    };

    window.addEventListener("beforeunload", startLoading);
    window.addEventListener("load", stopLoading);

    // 在路由变化时设置加载状态
    let currentUrl = window.location.href;
    const observer = new MutationObserver(() => {
      if (currentUrl !== window.location.href) {
        currentUrl = window.location.href;
        startLoading();
      }
    });

    observer.observe(document, { subtree: true, childList: true });

    return () => {
      window.removeEventListener("beforeunload", startLoading);
      window.removeEventListener("load", stopLoading);
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, []);

  // 路径或查询参数变化时停止加载
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="rounded-lg bg-background shadow-lg p-4 flex items-center space-x-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm font-medium">页面加载中...</span>
      </div>
    </div>
  );
}
