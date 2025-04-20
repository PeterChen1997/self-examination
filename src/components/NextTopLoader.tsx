"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// 进度条样式
const progressBarStyles = `
  .next-top-loader-progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, #2563eb, #3b82f6, #60a5fa);
    transform: translateX(-100%);
    z-index: 9999;
  }
  .next-top-loader-progress-bar--animating {
    transition: transform 0.2s ease-in-out;
  }
  .next-top-loader-progress-bar--complete {
    transform: translateX(0) !important;
    opacity: 0;
    transition: transform 0.4s ease-in-out, opacity 0.4s ease-in 0.4s;
  }
`;

export function NextTopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  // 添加进度条样式
  useEffect(() => {
    // 添加样式
    const style = document.createElement("style");
    style.textContent = progressBarStyles;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // 处理导航状态
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let animationTimeout: NodeJS.Timeout;

    const startLoading = () => {
      setComplete(false);
      setLoading(true);
      setProgress(0);

      progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          // 逐渐增加，但不到100%
          if (prevProgress >= 90) {
            return prevProgress + Math.random() * 0.1;
          }
          return prevProgress + Math.random() * 10;
        });
      }, 200);
    };

    const completeLoading = () => {
      clearInterval(progressInterval);
      setProgress(100);
      setComplete(true);

      // 动画结束后重置
      animationTimeout = setTimeout(() => {
        setLoading(false);
      }, 800);
    };

    const handleStart = (url: string) => {
      const currentUrl = `${pathname}${
        searchParams.toString() ? `?${searchParams}` : ""
      }`;
      if (url !== currentUrl) {
        startLoading();
      }
    };

    const handleComplete = () => {
      completeLoading();
    };

    // 添加事件监听
    document.addEventListener("next-route-announcer-focus", handleComplete);
    window.addEventListener("beforeunload", startLoading);

    // 监听URL变化
    let currentUrl = window.location.href;
    const observer = new MutationObserver(() => {
      if (currentUrl !== window.location.href) {
        handleStart(window.location.href);
        currentUrl = window.location.href;
      }
    });

    observer.observe(document, { subtree: true, childList: true });

    return () => {
      clearInterval(progressInterval);
      clearTimeout(animationTimeout);
      document.removeEventListener(
        "next-route-announcer-focus",
        handleComplete
      );
      window.removeEventListener("beforeunload", startLoading);
      observer.disconnect();
    };
  }, [pathname, searchParams]);

  // 路径变化时完成加载
  useEffect(() => {
    if (loading) {
      setProgress(100);
      setComplete(true);

      const timeout = setTimeout(() => {
        setLoading(false);
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [pathname, searchParams]);

  if (!loading) return null;

  return (
    <div
      className={`next-top-loader-progress-bar next-top-loader-progress-bar--animating ${
        complete ? "next-top-loader-progress-bar--complete" : ""
      }`}
      style={{ transform: `translateX(${progress - 100}%)` }}
    />
  );
}
