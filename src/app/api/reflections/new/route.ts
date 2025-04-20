import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";
import { z } from "zod";

// 反思数据验证
const reflectionSchema = z.object({
  knowledgeLearned: z.string().optional(),
  interestingAction: z.string().optional(),
  peopleSolved: z.string().optional(),
  date: z.string(),
});

// 创建新的反思
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const body = await req.json();
    const result = reflectionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "无效的输入数据", details: result.error.format() },
        { status: 400 }
      );
    }

    const { knowledgeLearned, interestingAction, peopleSolved, date } =
      result.data;

    const parsedDate = new Date(date);

    // 设置为当日的0点
    const startDate = new Date(parsedDate);
    startDate.setHours(0, 0, 0, 0);

    // 设置为当日的23:59:59
    const endDate = new Date(parsedDate);
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

    // 如果当天已有记录，则返回已有记录
    if (existingReflection) {
      return NextResponse.json(existingReflection, {
        headers: { "X-Reflection-Exists": "true" },
      });
    }

    // 创建新的反思记录
    const reflection = await prisma.reflection.create({
      data: {
        userId: session.user.id,
        date: parsedDate,
        knowledgeLearned: knowledgeLearned || null,
        interestingAction: interestingAction || null,
        peopleSolved: peopleSolved || null,
      },
    });

    return NextResponse.json(reflection);
  } catch (error) {
    console.error("创建反思失败:", error);
    return NextResponse.json(
      { error: "创建反思失败，请稍后再试" },
      { status: 500 }
    );
  }
}
