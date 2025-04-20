import { redirect } from "next/navigation";
import { getServerSession } from "@/auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import ReflectionForm from "@/components/ReflectionForm";

export default async function EditReflectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);

  // 未登录用户重定向到登录页
  if (!session?.user) {
    redirect("/login");
  }

  // 获取ID参数
  const { id } = await params;

  // 查询指定ID的反思
  const reflection = await prisma.reflection.findUnique({
    where: {
      id: id,
      userId: session.user.id, // 确保只能编辑自己的反思
    },
  });

  // 如果找不到反思，重定向到反思列表页
  if (!reflection) {
    redirect("/reflections");
  }

  return (
    <div className="container max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">编辑反思</h1>

      <ReflectionForm
        initialData={{
          ...reflection,
          date: reflection.date,
        }}
      />
    </div>
  );
}
