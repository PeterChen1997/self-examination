import { redirect } from "next/navigation";
import { getServerSession } from "@/auth";
import { authOptions } from "@/lib/auth";
import { format } from "date-fns";

export default async function TodayPage() {
  const session = await getServerSession(authOptions);

  // 未登录用户重定向到登录页
  if (!session?.user) {
    redirect("/login");
  }

  // 获取今天的日期，转换为YYYY-MM-DD格式
  const today = format(new Date(), "yyyy-MM-dd");

  // 重定向到今天的反思页面
  redirect(`/reflections/${today}`);
}
