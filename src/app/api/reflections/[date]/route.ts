import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

// 获取特定日期的反思
export async function GET(
  req: Request,
  { params }: { params: { date: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const date = new Date(params.date);

    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: "无效的日期格式" }, { status: 400 });
    }

    // 设置为当天的0点
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    // 设置为当天的23:59:59
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const reflection = await prisma.reflection.findFirst({
      where: {
        userId: session.user.id,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    if (!reflection) {
      return NextResponse.json(
        {
          exists: false,
          message: "当日未创建反思",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ exists: true, data: reflection });
  } catch (error) {
    console.error("获取反思失败:", error);
    return NextResponse.json(
      { error: "获取反思失败，请稍后再试" },
      { status: 500 }
    );
  }
}
