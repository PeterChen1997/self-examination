import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import ReflectionCard from "@/components/ReflectionCard";
import { PlusCircle } from "lucide-react";

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

export default async function ReflectionsPage() {
  const session = await getServerSession(authOptions);

  // 未登录用户重定向到登录页
  if (!session?.user) {
    redirect("/login");
  }

  // 获取用户的所有反思
  const reflections = await prisma.reflection.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      date: "desc",
    },
  });

  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">我的反思列表</h1>
        <Link href="/today">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            添加反思
          </Button>
        </Link>
      </div>

      {reflections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reflections.map((reflection: Reflection) => (
            <ReflectionCard
              key={reflection.id}
              id={reflection.id}
              date={reflection.date}
              knowledgeLearned={reflection.knowledgeLearned}
              interestingAction={reflection.interestingAction}
              peopleSolved={reflection.peopleSolved}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">还没有反思记录</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            创建你的第一条反思，开始记录每日成长
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
