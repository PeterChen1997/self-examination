import Link from "next/link";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Lightbulb, Handshake } from "lucide-react";

interface ReflectionCardProps {
  id: string;
  date: Date;
  knowledgeLearned?: string | null;
  interestingAction?: string | null;
  peopleSolved?: string | null;
  isCompact?: boolean;
}

export default function ReflectionCard({
  id,
  date,
  knowledgeLearned,
  interestingAction,
  peopleSolved,
  isCompact = false,
}: ReflectionCardProps) {
  const formattedDate = format(new Date(date), "yyyy年MM月dd日");

  // 展示预览内容
  const preview = (text: string | null | undefined, maxLength = 100) => {
    if (!text) return "无内容";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <Card
      className={`${
        isCompact ? "" : "h-full"
      } hover:shadow-md transition-shadow`}
    >
      <CardHeader>
        <CardTitle className="text-lg">{formattedDate}</CardTitle>
        <CardDescription>每日反思</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCompact ? (
          // 紧凑模式只显示一项内容
          knowledgeLearned && (
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  我学到了什么新知识？
                </p>
                <p className="text-sm mt-1">{preview(knowledgeLearned, 70)}</p>
              </div>
            </div>
          )
        ) : (
          // 完整模式显示所有内容
          <>
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  我学到了什么新知识？
                </p>
                <p className="text-sm mt-1">{preview(knowledgeLearned)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Lightbulb className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  我发起了什么有趣的事？
                </p>
                <p className="text-sm mt-1">{preview(interestingAction)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Handshake className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  我帮助了谁解决了问题？
                </p>
                <p className="text-sm mt-1">{preview(peopleSolved)}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href={`/reflections/${format(new Date(date), "yyyy-MM-dd")}`}
          className="w-full"
        >
          <Button variant="outline" size="sm" className="w-full">
            {isCompact ? "查看详情" : "编辑反思"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
