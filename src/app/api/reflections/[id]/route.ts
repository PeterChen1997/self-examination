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

// 根据ID获取单个反思
export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { id } = context.params;

    const reflection = await prisma.reflection.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!reflection) {
      return NextResponse.json({ error: "反思不存在" }, { status: 404 });
    }

    return NextResponse.json(reflection);
  } catch (error) {
    console.error("获取反思失败:", error);
    return NextResponse.json(
      { error: "获取反思失败，请稍后再试" },
      { status: 500 }
    );
  }
}

// 更新反思
export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { id } = context.params;
    const body = await req.json();
    const result = reflectionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "无效的输入数据", details: result.error.format() },
        { status: 400 }
      );
    }

    // 先验证该反思是否属于当前用户
    const existingReflection = await prisma.reflection.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!existingReflection) {
      return NextResponse.json(
        { error: "没有权限修改此反思或反思不存在" },
        { status: 403 }
      );
    }

    const { knowledgeLearned, interestingAction, peopleSolved, date } =
      result.data;

    // 确保使用传入的日期
    const parsedDate = new Date(date);

    // 确保日期有效，否则保留原日期
    const updatedDate = !isNaN(parsedDate.getTime())
      ? parsedDate
      : existingReflection.date;

    // 更新反思
    const updatedReflection = await prisma.reflection.update({
      where: {
        id: id,
      },
      data: {
        knowledgeLearned,
        interestingAction,
        peopleSolved,
        date: updatedDate,
      },
    });

    return NextResponse.json(updatedReflection);
  } catch (error) {
    console.error("更新反思失败:", error);
    return NextResponse.json(
      { error: "更新反思失败，请稍后再试" },
      { status: 500 }
    );
  }
}

// 为保持向后兼容，继续支持POST请求，但将其重定向到PUT方法
export async function POST(req: Request, context: { params: { id: string } }) {
  return PUT(req, context);
}

// 删除反思
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const { id } = context.params;

    // 先验证该反思是否属于当前用户
    const existingReflection = await prisma.reflection.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!existingReflection) {
      return NextResponse.json(
        { error: "没有权限删除此反思或反思不存在" },
        { status: 403 }
      );
    }

    // 删除反思
    await prisma.reflection.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("删除反思失败:", error);
    return NextResponse.json(
      { error: "删除反思失败，请稍后再试" },
      { status: 500 }
    );
  }
}
