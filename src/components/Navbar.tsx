"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <>
      <div className="mr-4 md:flex hidden">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold">自省笔记</span>
        </Link>
        {session?.user && (
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              首页
            </Link>
            <Link
              href="/reflections"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/reflections" ||
                pathname.startsWith("/reflections/")
                  ? "text-foreground"
                  : "text-foreground/60"
              }`}
            >
              回顾列表
            </Link>
            <Link
              href="/today"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/today" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              今日回顾
            </Link>
          </nav>
        )}
      </div>

      <div className="hidden md:flex flex-1 items-center justify-end">
        {!session?.user ? (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm">
                登录
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">注册</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              退出
            </Button>
            <Avatar>
              <AvatarFallback>
                {session.user.name?.charAt(0) ||
                  session.user.email?.charAt(0) ||
                  "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </>
  );
}
