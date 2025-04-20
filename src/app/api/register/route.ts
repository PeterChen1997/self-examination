import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import prisma from "@/lib/db";
import { z } from "zod";

// 验证请求数据
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 验证请求数据
    const { name, email, password } = userSchema.parse(body);

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "该邮箱已被注册" }, { status: 409 });
    }

    // 加密密码
    const hashedPassword = await hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "注册成功",
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("注册失败:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "无效的请求数据", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "注册过程中发生错误" },
      { status: 500 }
    );
  }
}
