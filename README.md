# 自省笔记

自省笔记是一个帮助用户每日反思和记录成长的应用，通过回答三个问题来培养持续成长的习惯。

## 核心功能

每天回答三个问题：
- ✨「我学到了什么新知识？」
- 💡「我发起了什么有趣的事？」
- 🤝「我帮助了谁解决了问题？」

## 技术栈

- 前端：Next.js 14, React 19, Tailwind CSS, shadcn/ui
- 后端：Next.js API Routes
- 数据库：PostgreSQL (Neon)
- 认证：NextAuth.js

## 本地开发

1. 克隆仓库
```bash
git clone <repository-url>
cd self-examination
```

2. 安装依赖
```bash
npm install
```

3. 设置环境变量
创建 `.env` 文件:
```
DATABASE_URL="your-neon-postgresql-url"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. 运行数据库迁移
```bash
npx prisma migrate dev
```

5. 启动开发服务器
```bash
npm run dev
```

6. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 功能特点

- 响应式设计，支持PC/移动端
- 邮箱密码认证
- 每日反思记录
- 按类别查看反思历史
- 可视化成长数据
