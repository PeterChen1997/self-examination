import { redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/db";
import ReflectionForm from "@/components/ReflectionForm";

export default async function ReflectionDetailPage({
  params,
}: {
  params: { date: string };
}) {
  const session = await auth();

  // 未登录用户重定向到登录页
  if (!session?.user) {
    redirect("/login");
  }

  // 解析日期
  const date = new Date(params.date);

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    // 如果日期无效，重定向到反思列表页
    redirect("/reflections");
  }

  // 设置为当天的0点
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  // 设置为当天的23:59:59
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  // 查询当天的反思
  const reflection = await prisma.reflection.findFirst({
    where: {
      userId: session.user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return (
    <div className="container max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {reflection ? "编辑反思" : "创建反思"}
      </h1>

      <ReflectionForm
        initialData={
          reflection
            ? {
                ...reflection,
                date: reflection.date,
              }
            : {
                id: "",
                knowledgeLearned: "",
                interestingAction: "",
                peopleSolved: "",
                date: date,
              }
        }
      />
    </div>
  );
}
