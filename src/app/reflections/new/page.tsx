import { redirect } from "next/navigation";
import { getServerSession } from "@/auth";
import { authOptions } from "@/lib/auth";
import ReflectionForm from "@/components/ReflectionForm";

export default async function NewReflectionPage() {
  const session = await getServerSession(authOptions);

  // 未登录用户重定向到登录页
  if (!session?.user) {
    redirect("/login");
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
