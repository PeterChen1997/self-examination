import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Sparkles,
  Lightbulb,
  Handshake,
  Pencil,
} from "lucide-react";

export default async function ReflectionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  // 未登录用户重定向到登录页
  if (!session?.user) {
    redirect("/login");
  }

  // 获取ID参数
  const { id } = params;

  // 查询指定ID的反思
  const reflection = await prisma.reflection.findUnique({
    where: {
      id: id,
      userId: session.user.id, // 确保只能查看自己的反思
    },
  });

  // 如果找不到反思，重定向到反思列表页
  if (!reflection) {
    redirect("/reflections");
  }

  // 格式化日期
  const formattedDate = format(new Date(reflection.date), "yyyy年MM月dd日");

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/reflections">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Button>
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{formattedDate}的反思</h1>
        <Link href={`/reflections/edit/${id}`}>
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            编辑
          </Button>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
            我学到了什么知识？
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80">
            {reflection.knowledgeLearned || "这一天，你没有记录学习内容"}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Lightbulb className="h-5 w-5 text-blue-500 mr-2" />
            我发起了什么有趣的事？
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80">
            {reflection.interestingAction || "这一天，你没有记录行动尝试"}
          </p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Handshake className="h-5 w-5 text-green-500 mr-2" />
            我帮助了谁解决了什么问题？
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground/80">
            {reflection.peopleSolved || "这一天，你没有记录助人经历"}
          </p>
        </CardContent>
      </Card>

      {/* <div className="flex justify-between">
        <Link href="/reflections">
          <Button variant="outline">返回列表</Button>
        </Link>
        <Link href={`/reflections/edit/${id}`}>
          <Button>编辑反思</Button>
        </Link>
      </div> */}
    </div>
  );
}
