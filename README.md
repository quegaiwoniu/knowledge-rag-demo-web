# knowledge-rag-demo-web

一个基于 `React + Vite + TypeScript` 的最小前端演示项目，用来对接后端仓库 `knowledge-rag-demo`。

它当前的目标不是做完整产品，而是提供一个**清晰、可演示、可联调**的 AI 能力工作台，方便我们验证：

- 后端是否启动
- AI 接口是否可用
- 文本总结是否能走通
- RAG 导入、切片、索引、检索和 grounded QA 是否可用

## 当前功能

- 调用 `GET /health`
- 调用 `GET /ai/ping`
- 调用 `POST /ai/summary`
- 调用 `POST /ai/extract`
- 调用 `POST /ai/tool-call`
- 调用 `POST /rag/ingest`
- 调用 `GET /rag/chunks`
- 调用 `POST /rag/index/rebuild`
- 调用 `GET /rag/index/status`
- 调用 `GET /rag/index/search`
- 调用 `POST /rag/ask`
- 展示引用、召回片段、拒答原因和 Trace ID
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

当前页面主要分成能力菜单、主工作区和状态侧栏：

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

### 4. RAG 工作区

作用：
- 执行文档导入、切片查看、索引重建和索引状态查询
- 调试向量检索结果和相似度评分
- 执行 grounded QA，查看答案、引用、召回片段和拒答原因

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
- `POST /ai/extract`
- `POST /ai/tool-call`
- `POST /rag/ingest`
- `GET /rag/chunks`
- `POST /rag/index/rebuild`
- `GET /rag/index/status`
- `GET /rag/index/search`
- `POST /rag/ask`
