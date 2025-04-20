"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogOut } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // 取消登出
  const handleCancel = () => {
    router.push("/");
  };

  // 确认登出
  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      // 使用 signOut 函数，无需指定 callbackUrl，因为我们已在 authOptions 中配置
      await signOut({ redirect: true });
    } catch (error) {
      console.error("退出登录失败:", error);
      router.push("/");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            <div className="flex items-center justify-center gap-2">
              <LogOut className="h-6 w-6" />
              <span>退出登录</span>
            </div>
          </CardTitle>
          <CardDescription className="text-center">
            您确定要退出登录吗？
          </CardDescription>
        </CardHeader>
        {/* <CardContent className="flex flex-col gap-4">
          <p className="text-center text-muted-foreground">
            退出后需要重新登录才能访问您的个人内容
          </p>
        </CardContent> */}
        <CardFooter>
          <div className="flex w-full gap-4">
            {/* <Button
              variant="outline"
              className="w-full"
              onClick={handleCancel}
              disabled={isLoggingOut}
            >
              取消
            </Button> */}
            <Button
              className="w-full"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "退出中..." : "确认退出"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
