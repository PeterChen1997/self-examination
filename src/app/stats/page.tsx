"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function StatsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalReflections: 0,
    knowledgeCount: 0,
    interestingCount: 0,
    peopleHelpedCount: 0,
    monthlyData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      fetchStats();
    }
  }, [status, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      if (!response.ok) throw new Error("获取统计信息失败");

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("获取统计信息失败:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="container max-w-4xl py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">加载中...</h1>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">我的成长统计</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">总反思数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReflections}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">知识学习</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.knowledgeCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">帮助他人</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.peopleHelpedCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>月度反思统计</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="反思数量" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
