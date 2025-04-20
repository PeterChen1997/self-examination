import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import ReflectionCard from "@/components/ReflectionCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  Lightbulb,
  Handshake,
  BookOpen,
  PlusCircle,
} from "lucide-react";
import { Prisma } from "@prisma/client";

// 定义反思类型
type Reflection = {
  id: string;
  date: Date;
  knowledgeLearned: string | null;
  interestingAction: string | null;
  peopleSolved: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export default async function HomePage() {
  const session = await auth();

  // 未登录用户显示欢迎页
  if (!session?.user) {
    return (
      <div className="container px-4 py-12 md:py-24">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8">
          <div className="w-full md:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              每日三问，
              <span className="text-primary">看见进步的自己</span>
            </h1>

            <p className="text-xl text-muted-foreground">
              通过回答这三个问题，记录你每天的成长轨迹，培养反思习惯，发现更好的自己。
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-yellow-500 shrink-0 mt-1" />
                <div>
                  <p className="font-medium">我学到了什么新知识？</p>
                  <p className="text-muted-foreground">
                    记录每天的学习收获，巩固知识，加深理解
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-blue-500 shrink-0 mt-1" />
                <div>
                  <p className="font-medium">我发起了什么有趣的事？</p>
                  <p className="text-muted-foreground">
                    培养行动力，记录自己的创意和尝试
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Handshake className="h-5 w-5 text-green-500 shrink-0 mt-1" />
                <div>
                  <p className="font-medium">我帮助了谁解决了问题？</p>
                  <p className="text-muted-foreground">
                    培养助人习惯，创造价值，增强自我价值感
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  开始记录
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  登录账户
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <div className="relative">
              <div className="aspect-square rounded-full bg-primary/10 absolute -top-8 -right-8 w-64 h-64 blur-3xl opacity-60" />
              <Card className="backdrop-blur border-2 border-primary/20 shadow-xl relative">
                <CardHeader>
                  <CardTitle>每日反思</CardTitle>
                  <CardDescription>2024年4月20日</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        我学到了什么新知识？
                      </p>
                      <p className="text-sm mt-1">
                        学习了React中的useEffect
                        Hook，理解了它的基本用法和依赖数组的作用。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        我发起了什么有趣的事？
                      </p>
                      <p className="text-sm mt-1">
                        和同事一起组织了一次线上阅读分享会，讨论了《原子习惯》这本书的核心观点。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Handshake className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
                        我帮助了谁解决了问题？
                      </p>
                      <p className="text-sm mt-1">
                        帮助新同事解决了一个困扰他两天的bug，并向他介绍了调试工具的使用方法。
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 已登录用户显示统计和最新反思
  const reflections = await prisma.reflection.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      date: "desc",
    },
    take: 15,
  });

  // 统计数据
  const totalReflections = await prisma.reflection.count({
    where: {
      userId: session.user.id,
    },
  });

  // 按类别获取最新5条
  const knowledgeReflections = reflections
    .filter(
      (r: Reflection) => r.knowledgeLearned && r.knowledgeLearned.trim() !== ""
    )
    .slice(0, 5);

  const actionReflections = reflections
    .filter(
      (r: Reflection) =>
        r.interestingAction && r.interestingAction.trim() !== ""
    )
    .slice(0, 5);

  const helpReflections = reflections
    .filter((r: Reflection) => r.peopleSolved && r.peopleSolved.trim() !== "")
    .slice(0, 5);

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-wrap gap-6 mb-8">
        <Card className="w-full sm:w-[calc(33.33%-1rem)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">反思总数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{totalReflections}</span>
              <span className="text-muted-foreground">条记录</span>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/reflections" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                查看所有记录
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="w-full sm:w-[calc(33.33%-1rem)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">今日反思</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">记录今天的收获和成长</p>
          </CardContent>
          <CardFooter>
            <Link href="/today" className="w-full">
              <Button size="sm" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                添加今日回顾
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {reflections.length > 0 ? (
        <>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            <span>最新学习收获</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {knowledgeReflections.length > 0 ? (
              knowledgeReflections.map((reflection: Reflection) => (
                <ReflectionCard
                  key={reflection.id}
                  id={reflection.id}
                  date={reflection.date}
                  knowledgeLearned={reflection.knowledgeLearned}
                  isCompact={true}
                />
              ))
            ) : (
              <p className="text-muted-foreground col-span-full">
                暂无学习记录
              </p>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            <span>最新行动尝试</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {actionReflections.length > 0 ? (
              actionReflections.map((reflection: Reflection) => (
                <ReflectionCard
                  key={reflection.id}
                  id={reflection.id}
                  date={reflection.date}
                  interestingAction={reflection.interestingAction}
                  isCompact={true}
                />
              ))
            ) : (
              <p className="text-muted-foreground col-span-full">
                暂无行动记录
              </p>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Handshake className="h-5 w-5 text-green-500" />
            <span>最新助人记录</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {helpReflections.length > 0 ? (
              helpReflections.map((reflection: Reflection) => (
                <ReflectionCard
                  key={reflection.id}
                  id={reflection.id}
                  date={reflection.date}
                  peopleSolved={reflection.peopleSolved}
                  isCompact={true}
                />
              ))
            ) : (
              <p className="text-muted-foreground col-span-full">
                暂无助人记录
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">开始记录你的每日反思</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            通过反思每日学习、行动和助人，你可以更清晰地看到自己的成长轨迹
          </p>
          <Link href="/today">
            <Button size="lg">
              <PlusCircle className="mr-2 h-5 w-5" />
              创建第一条反思
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
