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
  date: z.string().transform((val) => new Date(val)),
});

// 获取用户的所有反思
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const reflections = await prisma.reflection.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(reflections);
  } catch (error) {
    console.error("获取反思失败:", error);
    return NextResponse.json(
      { error: "获取反思失败，请稍后再试" },
      { status: 500 }
    );
  }
}

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

    // 创建或更新当日的反思
    const reflection = await prisma.reflection.upsert({
      where: {
        userDailyReflection: {
          userId: session.user.id,
          date: new Date(date.setHours(0, 0, 0, 0)), // 设置为当天的0点
        },
      },
      update: {
        knowledgeLearned,
        interestingAction,
        peopleSolved,
      },
      create: {
        userId: session.user.id,
        date: new Date(date.setHours(0, 0, 0, 0)), // 设置为当天的0点
        knowledgeLearned,
        interestingAction,
        peopleSolved,
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
