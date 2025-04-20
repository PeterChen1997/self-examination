import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getServerSession } from "@/auth";
import { authOptions } from "@/lib/auth";
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
  const session = await getServerSession(authOptions);

  // 未登录用户显示欢迎页
  if (!session?.user) {
    return (
      <div className="bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <div className="container max-w-screen-xl mx-auto px-4 py-4">
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
                <div className="rounded-lg overflow-hidden shadow-xl relative">
                  <Image
                    src="/hero.jpg"
                    alt="回顾笔记应用界面展示"
                    width={600}
                    height={400}
                    className="object-cover rounded-t-lg"
                    priority
                  />
                  <Card className="backdrop-blur border-0 shadow-none">
                    <CardHeader>
                      <CardTitle>每日反思</CardTitle>
                      <CardDescription>2024年4月20日</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm text-foreground/90">
                            我学到了什么新知识？
                          </p>
                          <p className="text-sm mt-1 text-muted-foreground">
                            学习了React中的useEffect
                            Hook，理解了它的基本用法和依赖数组的作用。
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm text-foreground/90">
                            我发起了什么有趣的事？
                          </p>
                          <p className="text-sm mt-1 text-muted-foreground">
                            和同事一起组织了一次线上阅读分享会，讨论了《原子习惯》这本书的核心观点。
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Handshake className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm text-foreground/90">
                            我帮助了谁解决了问题？
                          </p>
                          <p className="text-sm mt-1 text-muted-foreground">
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
        </div>

        {/* Features Section */}
        <div className="container max-w-screen-xl mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">为什么要做日常回顾？</h2>
            <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
              定期反思是成长的加速器，通过回顾过去的经历，我们能够更好地规划未来
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="flex flex-col h-full">
              <CardHeader>
                <Sparkles className="h-10 w-10 text-yellow-500 mb-2" />
                <CardTitle>知识积累</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  记录每天学到的新知识，不仅能加深理解，还能构建个人知识库，促进知识之间的连接
                </p>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <Lightbulb className="h-10 w-10 text-blue-500 mb-2" />
                <CardTitle>行动力提升</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  记录自己发起的事情，培养主动行动的习惯，看到自己的进步会激励你继续前进
                </p>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <CardHeader>
                <Handshake className="h-10 w-10 text-green-500 mb-2" />
                <CardTitle>价值创造</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  记录帮助他人的经历，不仅能增强你的自我价值感，还能让你发现自己的长处
                </p>
              </CardContent>
            </Card>
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
    <div className="container max-w-screen-xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="w-full h-full">
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

        <Card className="w-full h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">今日反思</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">记录今天的收获和成长</p>
          </CardContent>
          <CardFooter>
            <Link href="/reflections/new" className="w-full">
              <Button size="sm" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                添加今日回顾
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="w-full h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">我的成长趋势</CardTitle>
          </CardHeader>
          <CardContent className="h-24 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              持续记录，查看你的成长曲线
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/stats" className="w-full">
              <Button variant="outline" size="sm" className="w-full">
                查看统计
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
        <div className="text-center py-16 bg-muted/20 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">开始记录你的每日反思</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            通过反思每日学习、行动和助人，你可以更清晰地看到自己的成长轨迹
          </p>
          <Link href="/reflections/new">
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
