import { useCallback, useEffect, useState } from "react";
import { callWeatherTool, extractText, pingAi, summarizeText } from "./api/aiApi";
import { fetchHealth } from "./api/healthApi";
import {
  askRag,
  fetchRagChunks,
  fetchRagIndexStatus,
  ingestRagDocuments,
  rebuildRagIndex,
  searchRag,
} from "./api/ragApi";
import { AnswerPreviewCard } from "./components/AnswerPreviewCard";
import { CapabilityCard } from "./components/CapabilityCard";
import { CitationPreviewList } from "./components/CitationPreviewList";
import { ExtractPanel } from "./components/ExtractPanel";
import { ExtractResultCard } from "./components/ExtractResultCard";
import { HealthBadge } from "./components/HealthBadge";
import { PingPanel } from "./components/PingPanel";
import { RagChunksPanel } from "./components/RagChunksPanel";
import { RagIndexPanel } from "./components/RagIndexPanel";
import { RagIngestionPanel } from "./components/RagIngestionPanel";
import { RagSearchPanel } from "./components/RagSearchPanel";
import { RagQuestionPanel } from "./components/RagQuestionPanel";
import { StatusNotice } from "./components/StatusNotice";
import { SummaryPanel } from "./components/SummaryPanel";
import { WeatherToolPanel } from "./components/WeatherToolPanel";
import { WeatherToolResultCard } from "./components/WeatherToolResultCard";
import { useAsyncAction } from "./hooks/useAsyncAction";
import { useTraceId } from "./hooks/useTraceId";
import {
  type AiPingResponse,
  type ExtractResponse,
  type HealthResponse,
  type RagAskResponse,
  type RagChunksResponse,
  type RagIndexStatusResponse,
  type RagIngestResponse,
  type RagSearchResponse,
  type SummaryResponse,
  type ToolCallResponse,
} from "./types/api";

type CapabilityKey =
  | "ping"
  | "summary"
  | "extract"
  | "toolCalling"
  | "ragIngest"
  | "ragChunks"
  | "ragIndex"
  | "ragSearch"
  | "ragAsk";

const capabilityMenus: Array<{
  key: CapabilityKey;
  kicker: string;
  title: string;
  description: string;
}> = [
  {
    key: "ragIngest",
    kicker: "RAG Ingestion",
    title: "知识库文档导入",
    description: "读取 Markdown 样例语料，检查文档元数据。",
  },
  {
    key: "ragChunks",
    kicker: "RAG Chunks",
    title: "文档切片调试",
    description: "查看 chunk 顺序、章节和可追溯信息。",
  },
  {
    key: "ragIndex",
    kicker: "RAG Index",
    title: "向量索引管理",
    description: "重建索引并查看 pgvector 入库状态。",
  },
  {
    key: "ragSearch",
    kicker: "RAG Search",
    title: "向量检索",
    description: "输入问题，从 pgvector 召回最相关的文档片段。",
  },
  {
    key: "ragAsk",
    kicker: "Day 13 · Grounded QA",
    title: "证据问答与拒答",
    description: "基于召回证据生成答案，展示引用并在资料不足时拒答。",
  },
  {
    key: "ping",
    kicker: "Connectivity",
    title: "AI 连通性验证",
    description: "验证前后端和模型供应商是否连通。",
  },
  {
    key: "summary",
    kicker: "Summarization",
    title: "文本总结",
    description: "把长文本压缩成更容易阅读的总结。",
  },
  {
    key: "extract",
    kicker: "Structured Extraction",
    title: "结构化抽取",
    description: "抽取标题、分类、优先级和关键词。",
  },
  {
    key: "toolCalling",
    kicker: "Tool Calling",
    title: "天气工具调用",
    description: "演示模型触发外部工具并组织回答。",
  },
];

function App() {
  const [activeCapability, setActiveCapability] =
    useState<CapabilityKey>("ragIngest");

  // 最近一次请求的 traceId（来自响应头 X-Trace-Id）
  const traceId = useTraceId();

  const copyTraceId = useCallback(async () => {
    if (!traceId) return;
    try {
      await navigator.clipboard.writeText(traceId);
    } catch {
      // 剪贴板不可用时静默失败，不影响主流程
    }
  }, [traceId]);

  // 健康检查
  const health = useAsyncAction<HealthResponse>(fetchHealth);

  // AI 能力
  const ping = useAsyncAction<AiPingResponse>(pingAi);
  const summary = useAsyncAction<SummaryResponse>(summarizeText);
  const extract = useAsyncAction<ExtractResponse>(extractText);
  const toolCall = useAsyncAction<ToolCallResponse>(callWeatherTool);

  // RAG 能力
  const ragIngest = useAsyncAction<RagIngestResponse>(ingestRagDocuments);
  const ragChunks = useAsyncAction<RagChunksResponse>(fetchRagChunks);
  const ragIndex = useAsyncAction<RagIndexStatusResponse>(fetchRagIndexStatus);
  const ragSearch = useAsyncAction<RagSearchResponse>(searchRag);
  const ragAsk = useAsyncAction<RagAskResponse>(askRag);
  const [ragIndexRebuilding, setRagIndexRebuilding] = useState(false);

  // 页面加载时自动执行健康检查
  useEffect(() => {
    health.execute();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 索引重建（带进度提示）
  const handleRagIndexRebuild = useCallback(async () => {
    setRagIndexRebuilding(true);
    try {
      const result = await rebuildRagIndex();
      ragIndex.reset();
      return result;
    } finally {
      setRagIndexRebuilding(false);
    }
  }, [ragIndex]);

  const activeMenu =
    capabilityMenus.find((item) => item.key === activeCapability) ??
    capabilityMenus[0];

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Knowledge RAG Demo</p>
          <h1>AI 能力工作台</h1>
          <p className="hero-copy">
            这个工作台用于承接当前学习阶段的 AI 能力验证，包括模型连通性、文本总结、结构化抽取、Tool
            Calling
            和后续 RAG 问答能力。页面组织方式尽量贴近企业内部 AI 控制台，便于继续扩展
            Day 5 / Day 6。
          </p>
        </div>
        <HealthBadge
          data={health.data}
          loading={health.loading}
          error={health.error}
        />
      </header>

      <main className="dashboard-layout">
        <aside className="side-menu" aria-label="能力菜单">
          <div className="side-menu__header">
            <p className="eyebrow">Workspace</p>
            <h2>功能菜单</h2>
          </div>

          <nav className="side-menu__nav">
            {capabilityMenus.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`side-menu__item${activeCapability === item.key ? " side-menu__item--active" : ""}`}
                onClick={() => setActiveCapability(item.key)}
              >
                <span className="side-menu__kicker">{item.kicker}</span>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </button>
            ))}
          </nav>
        </aside>

        <section className="workspace-panel">
          <CapabilityCard
            kicker={activeMenu.kicker}
            title={activeMenu.title}
            description={activeMenu.description}
          >
            {activeCapability === "ping" ? (
              <>
                <PingPanel
                  onSubmit={ping.execute}
                  loading={ping.loading}
                />
                <AnswerPreviewCard
                  title="AI 连通性返回结果"
                  emptyTitle="还没有连通性结果"
                  emptyDescription="先发送一段消息，验证当前模型接入链路是否工作正常。"
                  answer={ping.data?.output ?? null}
                  meta={
                    ping.data
                      ? [
                          { label: "Provider", value: ping.data.provider },
                          { label: "Input", value: ping.data.input },
                        ]
                      : []
                  }
                  loading={ping.loading}
                />
                <StatusNotice tone="error" message={ping.error} />
              </>
            ) : null}

            {activeCapability === "summary" ? (
              <>
                <SummaryPanel
                  onSubmit={summary.execute}
                  loading={summary.loading}
                />
                <AnswerPreviewCard
                  title="文本总结结果"
                  emptyTitle="还没有总结结果"
                  emptyDescription="发送一段文本到 /ai/summary，这里会展示总结结果和基础元信息。"
                  answer={summary.data?.summary ?? null}
                  meta={
                    summary.data
                      ? [
                          {
                            label: "Original Length",
                            value: String(summary.data.originalLength),
                          },
                          {
                            label: "Truncated",
                            value: String(summary.data.truncated),
                          },
                        ]
                      : []
                  }
                  loading={summary.loading}
                />
                <StatusNotice tone="error" message={summary.error} />
              </>
            ) : null}

            {activeCapability === "extract" ? (
              <>
                <ExtractPanel
                  onSubmit={extract.execute}
                  loading={extract.loading}
                />
                <ExtractResultCard
                  data={extract.data}
                  loading={extract.loading}
                />
                <StatusNotice tone="error" message={extract.error} />
                <StatusNotice
                  tone="info"
                  message="推荐用故障反馈、需求描述、投诉记录和咨询文本来观察结构化抽取效果。"
                />
              </>
            ) : null}

            {activeCapability === "toolCalling" ? (
              <>
                <WeatherToolPanel
                  onSubmit={toolCall.execute}
                  loading={toolCall.loading}
                />
                <WeatherToolResultCard
                  data={toolCall.data}
                  loading={toolCall.loading}
                />
                <StatusNotice tone="error" message={toolCall.error} />
                <StatusNotice
                  tone="info"
                  message={'你可以试试\u201C北京今天天气怎么样\u201D或\u201C介绍一下这个项目\u201D，对比是否真的触发了工具。'}
                />
              </>
            ) : null}

            {activeCapability === "ragIngest" ? (
              <>
                <RagIngestionPanel
                  data={ragIngest.data}
                  loading={ragIngest.loading}
                  onIngest={ragIngest.execute}
                />
                <StatusNotice tone="error" message={ragIngest.error} />
                <StatusNotice
                  tone="info"
                  message="如果这里提示目录不存在，请先确认后端已重启，并加载了兼容父级工作区启动的路径解析代码。"
                />
              </>
            ) : null}

            {activeCapability === "ragChunks" ? (
              <>
                <RagChunksPanel
                  data={ragChunks.data}
                  loading={ragChunks.loading}
                  onRefresh={ragChunks.execute}
                />
                <StatusNotice tone="error" message={ragChunks.error} />
                <StatusNotice
                  tone="info"
                  message="切片结果来自后端内存中的最近一次导入；重启后端后需要重新执行文档导入。"
                />
              </>
            ) : null}

            {activeCapability === "ragIndex" ? (
              <>
                <RagIndexPanel
                  data={ragIndex.data}
                  loading={ragIndex.loading}
                  rebuilding={ragIndexRebuilding}
                  onRebuild={handleRagIndexRebuild}
                  onRefresh={ragIndex.execute}
                />
                <StatusNotice tone="error" message={ragIndex.error} />
                <StatusNotice
                  tone="info"
                  message="重建索引会执行完整流水线：导入 → 切片 → embedding → pgvector 入库。请确保 embedding 服务 API Key 已配置。"
                />
              </>
            ) : null}

            {activeCapability === "ragSearch" ? (
              <>
                <RagSearchPanel
                  onSearch={ragSearch.execute}
                  loading={ragSearch.loading}
                  error={ragSearch.error}
                  data={ragSearch.data}
                />
                <StatusNotice tone="error" message={ragSearch.error} />
                <StatusNotice
                  tone="info"
                  message="输入自然语言问题，后端调用 embedding 模型向量化后从 pgvector 召回最相似的文档片段。"
                />
              </>
            ) : null}

            {activeCapability === "ragAsk" ? (
              <>
                <RagQuestionPanel
                  onSubmit={ragAsk.execute}
                  loading={ragAsk.loading}
                />
                <AnswerPreviewCard
                  title="基于知识库的回答"
                  emptyTitle="还没有问答结果"
                  emptyDescription="在上方输入问题，系统会从知识库检索相关文档片段并生成回答。"
                  answer={ragAsk.data?.answer ?? null}
                  meta={
                    ragAsk.data
                      ? [
                          {
                            label: "上下文",
                            value: ragAsk.data.enoughContext
                              ? "证据充足"
                              : "证据不足，已拒答",
                          },
                          {
                            label: "引用数量",
                            value: String(ragAsk.data.citations.length),
                          },
                        ]
                      : []
                  }
                  loading={ragAsk.loading}
                />
                <StatusNotice tone="error" message={ragAsk.error} />
                {ragAsk.data ? (
                  <>
                    <CitationPreviewList
                      title="答案引用"
                      items={ragAsk.data.citations}
                      emptyMessage="本次回答未生成引用；证据不足时系统应直接拒答。"
                    />
                    <CitationPreviewList
                      title={`召回片段调试（${ragAsk.data.retrievedChunks.length}）`}
                      items={ragAsk.data.retrievedChunks}
                      emptyMessage="本次检索没有召回可用片段。"
                    />
                  </>
                ) : null}
                <StatusNotice
                  tone="info"
                  message="引用只能来自本次召回片段；当检索证据不足时，接口返回 enoughContext=false 并明确拒答。"
                />
              </>
            ) : null}
          </CapabilityCard>
        </section>

        <aside className="right-sidebar" aria-label="状态面板">
          <div className="sidebar-card">
            <h3>系统状态</h3>
            <ul className="status-list">
              <li>
                <span>后端服务</span>
                <span className={health.data ? "status-ok" : "status-error"}>
                  {health.data ? "已连接" : "未连接"}
                </span>
              </li>
              <li>
                <span>AI 模型</span>
                <span className="status-ok">已配置</span>
              </li>
              <li>
                <span>向量库</span>
                <span className="status-ok">pgvector</span>
              </li>
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>最近请求 Trace ID</h3>
            {traceId ? (
              <>
                <code className="trace-id" title="复制到剪贴板" onClick={copyTraceId}>
                  {traceId}
                </code>
                <p className="trace-id-hint">
                  报问题时把这段 ID 发给后端，即可定位本次请求的完整日志链路。
                </p>
              </>
            ) : (
              <p className="trace-id-hint">还没有发起过请求。</p>
            )}
          </div>

          <div className="sidebar-card">
            <h3>当前功能</h3>
            <p>{activeMenu.title} - {activeMenu.description}</p>
          </div>

          <div className="sidebar-card">
            <h3>使用提示</h3>
            <p>
              左侧选择功能模块，中间区域操作。RAG 相关功能需要确保后端已连接
              PostgreSQL 和 embedding 服务。
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;
