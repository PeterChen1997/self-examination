"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function MobileMenu() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const routes = [
    {
      href: "/",
      label: "首页",
      active: pathname === "/",
    },
    ...(session?.user
      ? [
          {
            href: "/reflections/new",
            label: "创建反思",
            active: pathname === "/reflections/new",
          },
          {
            href: "/reflections",
            label: "历史记录",
            active: pathname === "/reflections",
          },
          {
            href: "/stats",
            label: "我的统计",
            active: pathname === "/stats",
          },
          {
            href: "/profile",
            label: "个人中心",
            active: pathname === "/profile",
          },
        ]
      : []),
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">打开菜单</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="pt-10">
        <nav className="flex flex-col gap-4">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-lg font-medium transition-colors hover:text-primary ${
                route.active ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setOpen(false)}
            >
              {route.label}
            </Link>
          ))}
          {!session ? (
            <>
              <Link
                href="/login"
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setOpen(false)}
              >
                登录
              </Link>
              <Link
                href="/register"
                className="text-lg font-medium transition-colors hover:text-primary"
                onClick={() => setOpen(false)}
              >
                注册
              </Link>
            </>
          ) : (
            <Link
              href="/logout"
              className="text-lg font-medium transition-colors hover:text-primary"
              onClick={() => setOpen(false)}
            >
              退出登录
            </Link>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
