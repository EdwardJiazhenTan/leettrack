# LeetTrack

一个全栈应用程序，用于跟踪 LeetCode 进度，具有间隔重复学习和精选学习路径功能。

## 🚀 功能特性

### ✅ 已实现

- **身份验证系统**: 基于 JWT 的用户注册和登录
- **每日 LeetCode 题目**: 获取并显示每日编程挑战
- **直接 LeetCode 集成**: 基于 GraphQL 的 API 集成（无外部依赖）
- **学习路径**: 预构建的 NeetCode 75 路径，包含 18 个类别的 148 道题目
- **数据库集成**: AWS RDS PostgreSQL 与综合数据模型
- **现代化 UI**: 终端主题界面，采用 Catppuccin 配色方案
- **缓存系统**: 内存缓存以获得最佳性能
- **CORS 配置**: 适当的跨域资源共享设置

### 🎯 核心架构

- **后端**: Flask 与 SQLAlchemy、JWT 身份验证、GraphQL 集成
- **前端**: Next.js 15 与 TypeScript、现代 React 模式
- **数据库**: AWS RDS 上的 PostgreSQL，支持迁移
- **API 集成**: 直接 LeetCode GraphQL 查询（自托管解决方案）

## 🛠️ 技术栈

### 后端

- **框架**: Flask 2.3.3
- **数据库**: PostgreSQL (AWS RDS)
- **ORM**: SQLAlchemy 与 Flask-SQLAlchemy
- **身份验证**: Flask-JWT-Extended
- **迁移**: Flask-Migrate (Alembic)
- **API 集成**: 自定义 LeetCode GraphQL 客户端
- **CORS**: Flask-CORS

### 前端

- **框架**: Next.js 15.3.3
- **语言**: TypeScript
- **样式**: Tailwind CSS 与自定义终端主题
- **状态管理**: React Context API
- **HTTP 客户端**: 原生 Fetch API

### 数据库架构

- **用户**: 身份验证和个人资料管理
- **题目**: LeetCode 问题元数据
- **学习路径**: 精选问题集合
- **用户进度**: 跟踪和间隔重复
- **复习系统**: 计划复习功能

## 🚀 快速开始

### 前置要求

- Python 3.12+
- Node.js 18+
- PostgreSQL 数据库（已配置 AWS RDS）

### 安装

1. **克隆仓库**

```bash
git clone <repository-url>
cd LeetTrack
```

2. **后端设置**

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 设置环境变量
cp .env.example .env
# 编辑 .env 文件，填入数据库凭据

# 运行迁移
flask db upgrade
```

3. **前端设置**

```bash
cd frontend
npm install
```

4. **启动开发服务器**

```bash
# 从项目根目录
chmod +x run_dev.sh
./run_dev.sh
```

- 前端: http://localhost:3000
- 后端 API: http://localhost:5000

## 📊 当前状态

### 数据库

- ✅ AWS RDS PostgreSQL 已配置并连接
- ✅ 完整的架构，包含 9+ 个表
- ✅ 迁移系统已就位
- ✅ NeetCode 75 学习路径已填充（148 道题目）

### API 端点

- ✅ 身份验证: `/api/v1/auth/*`
- ✅ LeetCode 集成: `/api/v1/leetcode/*`
- ✅ 学习路径: `/api/v1/learning-paths/*`
- ✅ 用户进度: `/api/v1/user/*`

### 前端页面

- ✅ 主页仪表板，包含每日题目和学习路径
- ✅ 身份验证（登录/注册），采用终端 UI
- ✅ 响应式设计，现代化样式

## 📋 待办事项列表（优先级排序）

### 🔴 高优先级

1. **管理员/管理者仪表板**

   - 管理员特殊登录
   - 路径管理界面（创建、编辑、删除学习路径）
   - 用户监控和分析仪表板
   - 系统健康状况和使用统计

2. **社交身份验证**

   - Google OAuth 集成
   - GitHub OAuth 集成
   - 账户关联功能

3. **可重用题目组件**
   - 标准化题目显示组件
   - 代码编辑器集成
   - 解决方案提交界面
   - 进度跟踪小部件

### 🟡 中等优先级

4. **用户个人资料和设置**

   - 带统计信息的个人资料页面
   - 账户设置和偏好
   - LeetCode 个人资料同步
   - 进度可视化图表

5. **复习系统增强**

   - 题目复习计划页面
   - 间隔重复算法实现
   - 复习队列管理
   - 性能分析

6. **复习小部件**
   - 可嵌入网站的复习小部件
   - 可自定义外观和行为
   - 外部集成 API
   - 小部件配置仪表板

### 🟢 低优先级

7. **AI 集成**

   - AI 驱动的提示系统
   - 解决方案解释生成
   - 个性化学习推荐
   - 代码审查和优化建议

8. **UI/UX 改进**

   - 流畅的动画和过渡
   - 高级 CSS 样式
   - 主题自定义（深色/浅色模式）
   - 移动端响应性增强
   - 无障碍性改进

9. **部署和托管**

   - AWS EC2 后端部署
   - Vercel 前端部署
   - CI/CD 管道设置
   - 生产环境配置
   - SSL 证书和域名设置

10. **文档和社区**
    - 全面的 API 文档
    - 用户指南和教程
    - 贡献指南
    - 社区功能（论坛、讨论）
    - 集成示例和 SDK

## 🏗️ 架构决策

### LeetCode API 集成

- **决策**: 直接 GraphQL 集成而非外部 API
- **理由**: 消除速率限制（60 请求/小时），减少依赖
- **实现**: 带缓存的自定义 GraphQL 客户端

### 身份验证

- **决策**: 基于 JWT 的身份验证与刷新令牌
- **理由**: 无状态、可扩展、安全
- **实现**: Flask-JWT-Extended，1 小时访问令牌

### 数据库设计

- **决策**: 规范化关系架构
- **理由**: 数据完整性、复杂查询、关系管理
- **实现**: SQLAlchemy ORM 与迁移支持

## 🤝 贡献

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [NeetCode](https://neetcode.io/) 提供的精选题目集
- [LeetCode](https://leetcode.com/) 题目平台
- [Catppuccin](https://catppuccin.com/) 美丽的配色方案
- 开源社区提供的出色工具和库
