import { redirect } from "next/navigation";
import { getServerSession } from "@/auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import ReflectionDetailClient from "@/components/ReflectionDetailClient";

export default async function ReflectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  // 未登录用户重定向到登录页
  if (!session?.user) {
    redirect("/login");
  }

  // 获取参数
  const { id } = await params;

  // 查询数据库
  const reflection = await prisma.reflection.findUnique({
    where: {
      id: id,
      userId: session.user.id,
    },
  });

  // 如果找不到反思，重定向到反思列表页
  if (!reflection) {
    redirect("/reflections");
  }

  return <ReflectionDetailClient reflection={reflection} />;
}
