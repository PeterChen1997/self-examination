import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    // 获取用户的所有反思
    const reflections = await prisma.reflection.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        knowledgeLearned: true,
        interestingAction: true,
        peopleSolved: true,
        date: true,
      },
    });

    // 计算基本统计数据
    const totalReflections = reflections.length;

    // 计算有填写内容的数量
    const knowledgeCount = reflections.filter(
      (r) => r.knowledgeLearned && r.knowledgeLearned.trim() !== ""
    ).length;

    const interestingCount = reflections.filter(
      (r) => r.interestingAction && r.interestingAction.trim() !== ""
    ).length;

    const peopleHelpedCount = reflections.filter(
      (r) => r.peopleSolved && r.peopleSolved.trim() !== ""
    ).length;

    // 生成月度数据
    const monthlyData = generateMonthlyData(reflections);

    return NextResponse.json({
      totalReflections,
      knowledgeCount,
      interestingCount,
      peopleHelpedCount,
      monthlyData,
    });
  } catch (error) {
    console.error("获取统计数据失败:", error);
    return NextResponse.json(
      { error: "获取统计数据失败，请稍后再试" },
      { status: 500 }
    );
  }
}

// 定义反思数据类型
type ReflectionData = {
  id: string;
  knowledgeLearned: string | null;
  interestingAction: string | null;
  peopleSolved: string | null;
  date: Date;
};

// 定义月度数据类型
interface MonthlyCountMap {
  [key: string]: number;
}

// 生成月度数据
function generateMonthlyData(reflections: ReflectionData[]) {
  // 创建一个用于存储月度数据的对象
  const monthlyCountMap: MonthlyCountMap = {};

  // 遍历所有反思，按月份分组计数
  reflections.forEach((reflection) => {
    const date = new Date(reflection.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!monthlyCountMap[monthKey]) {
      monthlyCountMap[monthKey] = 0;
    }

    monthlyCountMap[monthKey]++;
  });

  // 转换为图表需要的格式
  const monthlyData = Object.keys(monthlyCountMap)
    .sort() // 按时间顺序排序
    .map((monthKey) => {
      const [year, month] = monthKey.split("-");
      return {
        month: `${year}年${month}月`,
        count: monthlyCountMap[monthKey],
      };
    });

  return monthlyData;
}
