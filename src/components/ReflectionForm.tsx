"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// 反思数据模式
const reflectionSchema = z.object({
  knowledgeLearned: z.string().min(1, { message: "请填写您学到的新知识" }),
  interestingAction: z.string().min(1, { message: "请填写您发起的有趣事情" }),
  peopleSolved: z.string().min(1, { message: "请填写您帮助解决问题的人" }),
  date: z.date(),
});

type ReflectionFormValues = z.infer<typeof reflectionSchema>;

interface ReflectionFormProps {
  initialData?: {
    id: string;
    knowledgeLearned?: string | null;
    interestingAction?: string | null;
    peopleSolved?: string | null;
    date: Date;
  } | null;
}

export default function ReflectionForm({ initialData }: ReflectionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 使用react-hook-form
  const form = useForm<ReflectionFormValues>({
    resolver: zodResolver(reflectionSchema),
    defaultValues: {
      knowledgeLearned: initialData?.knowledgeLearned || "",
      interestingAction: initialData?.interestingAction || "",
      peopleSolved: initialData?.peopleSolved || "",
      date: initialData?.date || new Date(),
    },
  });

  const onSubmit = async (values: ReflectionFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reflections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          date: values.date.toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "提交失败");
      }

      toast.success(initialData ? "反思更新成功" : "反思创建成功");
      router.push("/reflections");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "提交过程中出错");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>日期</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "yyyy年MM月dd日")
                      ) : (
                        <span>选择日期</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="knowledgeLearned"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="flex items-center">
                  <span className="mr-2 text-xl">✨</span>
                  我学到了什么新知识？
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="今天我学习到了..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="interestingAction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="flex items-center">
                  <span className="mr-2 text-xl">💡</span>
                  我发起了什么有趣的事？
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="今天我发起了..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="peopleSolved"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span className="flex items-center">
                  <span className="mr-2 text-xl">🤝</span>
                  我帮助了谁解决了问题？
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="今天我帮助..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              提交中...
            </>
          ) : (
            "提交反思"
          )}
        </Button>
      </form>
    </Form>
  );
}
