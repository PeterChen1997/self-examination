"use client";

import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Session } from "next-auth";
import MobileMenu from "./MobileMenu";

export default function NavbarClient({ session }: { session: Session | null }) {
  return (
    <>
      {/* Logo区域 */}
      <div className="flex items-center space-x-2">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/pen.png" alt="三问日记" width={20} height={20} />
          <span className="font-bold text-lg">三问日记</span>
        </Link>
      </div>

      {/* 导航菜单 */}
      <NavigationMenu className="hidden md:flex">
        <NavigationMenuList>
          {/* <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                首页
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem> */}
          {session?.user && (
            <>
              <NavigationMenuItem>
                <Link href="/reflections/new" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    创建反思
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/reflections" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    历史记录
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/stats" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    我的统计
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </>
          )}
        </NavigationMenuList>
      </NavigationMenu>

      {/* 用户信息/登录按钮 */}
      <div className="flex items-center gap-2">
        {session?.user ? (
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {session.user.name
                  ? session.user.name.charAt(0).toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <Link
              href="/logout"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              退出
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              登录
            </Link>
            <Link href="/register" className={buttonVariants({ size: "sm" })}>
              注册
            </Link>
          </div>
        )}

        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </>
  );
}
