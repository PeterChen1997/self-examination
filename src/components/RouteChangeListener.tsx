"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// 配置NProgress
NProgress.configure({
  showSpinner: true,
  trickleSpeed: 200,
  minimum: 0.1,
});

export function RouteChangeListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 监听路由变化
  useEffect(() => {
    // 首次加载不显示进度条
    let timer: NodeJS.Timeout;

    const handleRouteChangeStart = () => {
      timer = setTimeout(() => {
        NProgress.start();
      }, 200); // 短暂延迟避免快速导航闪烁
    };

    const handleRouteChangeComplete = () => {
      clearTimeout(timer);
      NProgress.done();
    };

    const handleRouteChangeError = () => {
      clearTimeout(timer);
      NProgress.done();
    };

    // 添加路由事件监听器
    window.addEventListener("beforeunload", handleRouteChangeStart);
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeError);

    // 组件卸载时清理
    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeunload", handleRouteChangeStart);
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, []);

  // 路由或查询参数变化时
  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}
