"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut } from "lucide-react";

// 主要内容
function LogoutContent() {
  const { data: session, status } = useSession();

  // 页面加载时自动登出
  useEffect(() => {
    // 如果已经是未登录状态，直接跳转到首页
    if (status === "unauthenticated") {
      window.location.href = "/";
    }
  }, [status, session]);

  return (
    <div className="max-w-md w-full mx-auto px-4">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            <div className="flex items-center justify-center gap-2">
              <LogOut className="h-6 w-6" />
              <span>退出登录</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <div className="flex w-full">
            <LogoutButton />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// 分离包含useSearchParams的逻辑
function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 执行登出
  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      // 获取当前站点的绝对URL
      const baseUrl = window.location.origin;
      const callbackUrl = `${baseUrl}/`;

      // 使用绝对URL作为回调
      await signOut({
        callbackUrl,
        redirect: false,
      });

      // 手动处理重定向
      setTimeout(() => {
        window.location.href = callbackUrl;
      }, 500);
    } catch (error) {
      console.error("退出登录失败:", error);
      // 出错时也跳转到首页
      window.location.href = window.location.origin;
    }
  };

  return (
    <Button className="w-full" onClick={handleLogout} disabled={isLoggingOut}>
      {isLoggingOut ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 退出中...
        </>
      ) : (
        "确认退出"
      )}
    </Button>
  );
}

export default function LogoutPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md w-full mx-auto px-4">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                <div className="flex items-center justify-center gap-2">
                  <LogOut className="h-6 w-6" />
                  <span>退出登录</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <div className="flex w-full">
                <Button className="w-full" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 加载中...
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      }
    >
      <LogoutContent />
    </Suspense>
  );
}
