"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import ReflectionCard from "@/components/ReflectionCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Reflection = {
  id: string;
  knowledgeLearned: string;
  interestingAction: string;
  peopleSolved: string;
  date: string;
  createdAt: string;
  userId: string;
};

// 拆分使用了路由功能的组件
function ProfileContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      fetchReflections();
    }
  }, [status, router]);

  const fetchReflections = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/reflections");
      if (!response.ok) {
        throw new Error("获取反思记录失败");
      }
      const data = await response.json();
      setReflections(data);
    } catch (error) {
      console.error("获取反思记录时出错:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    fetchReflections();
  };

  if (status === "loading") {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-2xl">个人中心</CardTitle>
            <CardDescription>管理您的个人信息和反思记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="bg-primary/10 rounded-full p-4 text-primary text-xl font-semibold">
                {session?.user?.name?.[0] || "用户"}
              </div>
              <div>
                <h3 className="text-lg font-medium">
                  {session?.user?.name || "未知用户"}
                </h3>
                <p className="text-muted-foreground">
                  {session?.user?.email || "未知邮箱"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">我的反思记录</h2>
        <Button onClick={() => router.push("/today")}>
          <Plus className="mr-2 h-4 w-4" />
          添加反思
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : reflections.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reflections.map((reflection) => (
            <ReflectionCard
              key={reflection.id}
              reflection={reflection}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-medium mb-2">您还没有反思记录</h3>
          <p className="text-muted-foreground mb-4">
            开始记录您的日常反思，更好地了解自己
          </p>
          <Button onClick={() => router.push("/today")}>
            <Plus className="mr-2 h-4 w-4" />
            添加第一条反思
          </Button>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
