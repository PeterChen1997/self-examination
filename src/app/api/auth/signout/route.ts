import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  // 重定向到自定义登出页面
  redirect("/logout");
}

// 处理POST请求的登出
export async function POST() {
  return NextResponse.json({ success: true });
}
