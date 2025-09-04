# 迁移到Next.js的资产管理系统

这个项目已经从Vite + Express架构迁移到Next.js架构。

## 主要变更

1. **前端框架**：从Vite迁移到Next.js
2. **路由系统**：使用Next.js的文件系统路由
3. **API路由**：将Express API迁移到Next.js API路由
4. **构建系统**：使用Next.js的构建和开发工具

## 项目结构

```
.
├── pages/                 # Next.js页面目录
│   ├── api/               # API路由
│   ├── index.jsx          # 首页
│   ├── category-management.jsx  # 分类管理页面
│   └── _app.jsx           # 自定义App组件
├── src/                   # 原始源代码
│   ├── components/        # React组件
│   ├── contexts/          # React Context
│   └── ...                # 其他源代码
├── server/                # 后端相关文件
│   └── prisma/            # Prisma配置
└── ...                    # 其他配置文件
```

## 运行项目

1. 安装依赖：
   ```bash
   npm install
   ```

2. 运行开发服务器：
   ```bash
   npm run dev
   ```

3. 构建生产版本：
   ```bash
   npm run build
   ```

4. 启动生产服务器：
   ```bash
   npm start
   ```

## API路由

- GET /api/bills - 获取所有账单
- POST /api/bills - 创建新账单
- PATCH /api/bills/[id] - 更新账单
- DELETE /api/bills/[id] - 删除账单

## 注意事项

1. 数据库连接配置保持不变，仍使用Prisma客户端
2. 前端组件代码基本未改动，保持原有功能
3. API路由实现了与原Express API相同的功能