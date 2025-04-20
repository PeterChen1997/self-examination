"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Trash2, Edit, Calendar } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Reflection = {
  id: string;
  knowledgeLearned?: string | null;
  interestingAction?: string | null;
  peopleSolved?: string | null;
  date: string | Date;
  createdAt?: string | Date;
  userId?: string;
};

export interface ReflectionCardProps {
  reflection?: Reflection;
  id?: string;
  date?: Date | string;
  knowledgeLearned?: string | null;
  interestingAction?: string | null;
  peopleSolved?: string | null;
  isCompact?: boolean;
  onDelete?: () => void;
}

export default function ReflectionCard({
  reflection,
  id,
  date,
  knowledgeLearned,
  interestingAction,
  peopleSolved,
  isCompact = false,
  onDelete,
}: ReflectionCardProps) {
  const router = useRouter();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // 使用单独的props或reflection对象的属性
  const reflectionId = id || reflection?.id;
  const reflectionDate =
    date ||
    (reflection?.date ? new Date(reflection.date) : undefined) ||
    (reflection?.createdAt ? new Date(reflection.createdAt) : new Date());
  const knowledgeContent = knowledgeLearned || reflection?.knowledgeLearned;
  const actionContent = interestingAction || reflection?.interestingAction;
  const helpContent = peopleSolved || reflection?.peopleSolved;

  const handleDelete = async () => {
    if (!reflectionId || !onDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/reflections/${reflectionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("删除反思记录失败");
      }

      onDelete();
    } catch (error) {
      console.error("删除反思时出错:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteAlert(false);
    }
  };

  // 简洁版卡片，用于首页展示
  if (isCompact) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {format(new Date(reflectionDate), "yyyy年MM月dd日")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {knowledgeContent && (
            <p className="text-sm line-clamp-3">{knowledgeContent}</p>
          )}
          {actionContent && (
            <p className="text-sm line-clamp-3">{actionContent}</p>
          )}
          {helpContent && <p className="text-sm line-clamp-3">{helpContent}</p>}
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => router.push(`/reflections/view/${reflectionId}`)}
          >
            查看详情
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // 完整版卡片
  return (
    <>
      <Card className="h-full overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {format(new Date(reflectionDate), "yyyy年MM月dd日")}的反思
            </CardTitle>
            {onDelete && (
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    router.push(`/reflections/edit/${reflectionId}`)
                  }
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">编辑</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteAlert(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">删除</span>
                </Button>
              </div>
            )}
          </div>
          {reflection?.createdAt && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              {format(new Date(reflection.createdAt), "yyyy-MM-dd HH:mm")}
            </div>
          )}
        </CardHeader>
        <CardContent className="pb-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">今天学到了什么知识？</h3>
              <p className="mt-1 text-muted-foreground">
                {knowledgeContent || "无记录"}
              </p>
            </div>
            <div>
              <h3 className="font-medium">有趣/有启发的行为？</h3>
              <p className="mt-1 text-muted-foreground">
                {actionContent || "无记录"}
              </p>
            </div>
            <div>
              <h3 className="font-medium">今天帮助了谁解决了什么问题？</h3>
              <p className="mt-1 text-muted-foreground">
                {helpContent || "无记录"}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push(`/reflections/view/${reflectionId}`)}
          >
            查看详情
          </Button>
        </CardFooter>
      </Card>

      {onDelete && (
        <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确定要删除这条反思记录吗？</AlertDialogTitle>
              <AlertDialogDescription>
                此操作不可逆，删除后将无法恢复该反思记录。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? "删除中..." : "确认删除"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
