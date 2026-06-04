# knowledge-rag-demo-web

一个基于 `React + Vite + TypeScript` 的最小前端演示项目，用来对接后端仓库 `knowledge-rag-demo`。

它当前的目标不是做完整产品，而是提供一个**清晰、可演示、可联调**的页面，方便我们验证：

- 后端是否启动
- AI 接口是否可用
- 文本总结是否能走通
- 后续 RAG 页面布局是否合理

## 当前功能

- 调用 `GET /health`
- 调用 `GET /ai/ping`
- 调用 `POST /ai/summary`
- 预留 RAG 问答区和引用展示区
- 处理 `loading / error / empty` 状态

## 技术栈

- React
- Vite
- TypeScript

## 目录结构

```text
src
├─ api         // 后端接口调用层
├─ components  // 页面组件
├─ styles      // 样式和颜色变量
├─ types       // TypeScript 类型定义
├─ App.tsx     // 单页入口
└─ main.tsx    // 应用启动入口
```

## 页面说明

当前页面主要分成 3 块：

### 1. 健康检查区

作用：
- 查看后端服务是否可访问
- 作为联调时的第一个检查点

### 2. AI 调试区

作用：
- 调用 `/ai/ping`
- 快速确认前后端链路和模型调用是否正常

### 3. 文本总结区

作用：
- 输入一段文本
- 调用 `/ai/summary`
- 展示摘要结果

### 4. RAG 预留区

作用：
- 先把后续知识库问答页面结构摆出来
- 后面补 `/rag/ask` 时不用重做整体布局

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动前端

```bash
npm run dev
```

默认地址：

- 前端页面：[http://127.0.0.1:5173/](http://127.0.0.1:5173/)

## 后端地址

默认请求：

```text
http://localhost:8080
```

如果后端地址不同，可以通过环境变量覆盖：

```bash
VITE_API_BASE_URL=http://your-host:port
```

## 对接的后端接口

当前已经接入：

- `GET /health`
- `GET /ai/ping`
- `POST /ai/summary`

后面适合继续接入：

- `POST /rag/search`
- `POST /rag/ask`

## 下一步建议

这个仓库后面最适合继续补这些内容：

1. 把 RAG 预留区接成真实问答区
2. 增加引用来源列表
3. 增加摘要历史或请求日志
4. 优化中文展示和错误提示
5. 增加 Agent 演示页风格的执行过程展示

