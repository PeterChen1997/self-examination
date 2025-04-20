"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, PencilIcon, TrashIcon } from "lucide-react";

// 反思数据类型
type Reflection = {
  id: string;
  knowledgeLearned: string | null;
  interestingAction: string | null;
  peopleSolved: string | null;
  date: string;
};

export default function ReflectionPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { id } = params;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchReflection();
    }
  }, [status, id, router]);

  const fetchReflection = async () => {
    try {
      const response = await fetch(`/api/reflections/${id}`);

      if (!response.ok) {
        if (response.status === 404) {
          setError("找不到该反思记录");
        } else {
          setError("获取反思数据失败");
        }
        return;
      }

      const data = await response.json();
      setReflection(data);
    } catch (err) {
      setError("获取数据时发生错误");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("确定要删除这条反思记录吗？此操作不可恢复。")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/reflections/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/reflections");
      } else {
        const data = await response.json();
        setError(data.error || "删除失败");
      }
    } catch (err) {
      setError("删除时发生错误");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container max-w-3xl py-8">
        <p className="text-center">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-3xl py-8">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-center text-red-500">{error}</p>
            <div className="mt-4 flex justify-center">
              <Button onClick={() => router.push("/reflections")}>
                返回列表
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!reflection) {
    return null;
  }

  return (
    <div className="container max-w-3xl py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">反思详情</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/reflections/edit/${reflection.id}`)}
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            编辑
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            删除
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>日期</CardTitle>
            <div className="flex items-center text-muted-foreground">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {reflection.date
                ? format(new Date(reflection.date), "yyyy年MM月dd日")
                : "未知日期"}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>今日所学</CardTitle>
        </CardHeader>
        <CardContent>
          {reflection.knowledgeLearned ? (
            <p className="whitespace-pre-line">{reflection.knowledgeLearned}</p>
          ) : (
            <p className="text-muted-foreground italic">暂无记录</p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>有趣行动</CardTitle>
        </CardHeader>
        <CardContent>
          {reflection.interestingAction ? (
            <p className="whitespace-pre-line">
              {reflection.interestingAction}
            </p>
          ) : (
            <p className="text-muted-foreground italic">暂无记录</p>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>帮助他人</CardTitle>
        </CardHeader>
        <CardContent>
          {reflection.peopleSolved ? (
            <p className="whitespace-pre-line">{reflection.peopleSolved}</p>
          ) : (
            <p className="text-muted-foreground italic">暂无记录</p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-center mt-8">
        <Button onClick={() => router.push("/reflections")}>返回列表</Button>
      </div>
    </div>
  );
}
