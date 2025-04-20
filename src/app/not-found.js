import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4">
      <div className="max-w-md w-full mx-auto">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold">404</h1>
          <h2 className="text-2xl font-medium">页面未找到</h2>
          <p className="text-gray-600">您尝试访问的页面不存在或已被移动。</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
