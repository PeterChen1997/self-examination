import { redirect } from "next/navigation";
import { getServerSession } from "@/auth";
import { authOptions } from "@/lib/auth";
import ReflectionForm from "@/components/ReflectionForm";
import prisma from "@/lib/db";
import { format } from "date-fns";

export default async function NewReflectionPage() {
  const session = await getServerSession(authOptions);

  // 未登录用户重定向到登录页
  if (!session?.user) {
    redirect("/login");
  }

  // 获取今天的日期
  const today = new Date();
  const formattedDate = format(today, "yyyy-MM-dd");

  // 设置为今天的0点
  const startDate = new Date(today);
  startDate.setHours(0, 0, 0, 0);

  // 设置为今天的23:59:59
  const endDate = new Date(today);
  endDate.setHours(23, 59, 59, 999);

  // 查询当天是否已有反思记录
  const existingReflection = await prisma.reflection.findFirst({
    where: {
      userId: session.user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  // 如果当天已有记录，则重定向到当天的反思页面
  if (existingReflection) {
    redirect(`/reflections/${formattedDate}`);
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">创建新反思</h1>
        <p className="text-muted-foreground">记录今天的成长，培养反思习惯</p>
      </div>
      <ReflectionForm />
    </div>
  );
}
