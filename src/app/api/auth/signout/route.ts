import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 获取查询参数中可能存在的回调URL
  const url = new URL(request.url);
  const callbackUrl = url.searchParams.get("callbackUrl") || "/";

  // 构建绝对URL
  const baseUrl = `${url.protocol}//${url.host}`;
  const absoluteUrl = callbackUrl.startsWith("http")
    ? callbackUrl
    : `${baseUrl}${
        callbackUrl.startsWith("/") ? callbackUrl : `/${callbackUrl}`
      }`;

  // 创建响应对象，设置重定向
  const response = NextResponse.redirect(absoluteUrl);

  // 清除所有会话相关cookie
  const cookieNames = [
    "next-auth.session-token",
    "next-auth.callback-url",
    "next-auth.csrf-token",
    "__Secure-next-auth.callback-url",
    "__Secure-next-auth.session-token",
    "__Secure-next-auth.csrf-token",
    "__Host-next-auth.csrf-token",
  ];

  // 通过设置过期时间来清除cookie
  cookieNames.forEach((name) => {
    response.cookies.set({
      name,
      value: "",
      expires: new Date(0),
      path: "/",
    });
  });

  return response;
}

// 支持POST请求的登出
export async function POST(request: Request) {
  // 处理与GET相同的逻辑
  return GET(request);
}

// 支持其他HTTP方法
export const HEAD = GET;
export const OPTIONS = GET;
