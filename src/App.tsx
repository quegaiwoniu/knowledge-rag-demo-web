import { useEffect, useState } from "react";
import { callWeatherTool, extractText, pingAi, summarizeText } from "./api/aiApi";
import { fetchHealth } from "./api/healthApi";
import { ingestRagDocuments } from "./api/ragApi";
import { AnswerPreviewCard } from "./components/AnswerPreviewCard";
import { CapabilityCard } from "./components/CapabilityCard";
import { CitationPreviewList } from "./components/CitationPreviewList";
import { ExtractPanel } from "./components/ExtractPanel";
import { ExtractResultCard } from "./components/ExtractResultCard";
import { HealthBadge } from "./components/HealthBadge";
import { PingPanel } from "./components/PingPanel";
import { RagIngestionPanel } from "./components/RagIngestionPanel";
import { RagQuestionPanel } from "./components/RagQuestionPanel";
import { StatusNotice } from "./components/StatusNotice";
import { SummaryPanel } from "./components/SummaryPanel";
import { WeatherToolPanel } from "./components/WeatherToolPanel";
import { WeatherToolResultCard } from "./components/WeatherToolResultCard";
import {
  type AiPingResponse,
  type CitationPreview,
  type ExtractResponse,
  type HealthResponse,
  type RagIngestResponse,
  type SummaryResponse,
  type ToolCallResponse
} from "./types/api";

type CapabilityKey = "ping" | "summary" | "extract" | "toolCalling" | "ragIngest" | "ragRoadmap";

/**
 * 左侧菜单配置。
 *
 * 把菜单文案集中放在这里，后续新增 Day 10 / Day 11 能力页时，
 * 只需要补一个菜单项和一个右侧内容分支。
 */
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
    description: "读取 Markdown 样例语料，检查文档元数据。"
  },
  {
    key: "ragRoadmap",
    kicker: "RAG Roadmap",
    title: "RAG 能力预留",
    description: "后续承接检索、引用和问答链路。"
  },
  {
    key: "ping",
    kicker: "Connectivity",
    title: "AI 连通性验证",
    description: "验证前后端和模型供应商是否连通。"
  },
  {
    key: "summary",
    kicker: "Summarization",
    title: "文本总结",
    description: "把长文本压缩成更容易阅读的总结。"
  },
  {
    key: "extract",
    kicker: "Structured Extraction",
    title: "结构化抽取",
    description: "抽取标题、分类、优先级和关键词。"
  },
  {
    key: "toolCalling",
    kicker: "Tool Calling",
    title: "天气工具调用",
    description: "演示模型触发外部工具并组织回答。"
  }
];

const previewCitations: CitationPreview[] = [
  {
    fileName: "faq.md",
    chunkIndex: 2,
    snippet: "这里后续会展示 RAG 返回的文档名、分片编号和片段摘要。"
  },
  {
    fileName: "troubleshooting.md",
    chunkIndex: 5,
    snippet: "这个区域已经提前把 /rag/ask 的答案与引用展示结构预留好了。"
  }
];

function App() {
  /**
   * 当前选中的工作台能力页。
   *
   * 默认打开“知识库文档导入”，因为 Week 2 当前主线是 RAG 项目。
   */
  const [activeCapability, setActiveCapability] = useState<CapabilityKey>("ragIngest");

  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);
  const [healthError, setHealthError] = useState<string | null>(null);

  const [pingData, setPingData] = useState<AiPingResponse | null>(null);
  const [pingLoading, setPingLoading] = useState(false);
  const [pingError, setPingError] = useState<string | null>(null);

  const [summaryData, setSummaryData] = useState<SummaryResponse | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const [extractData, setExtractData] = useState<ExtractResponse | null>(null);
  const [extractLoading, setExtractLoading] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  const [toolCallData, setToolCallData] = useState<ToolCallResponse | null>(null);
  const [toolCallLoading, setToolCallLoading] = useState(false);
  const [toolCallError, setToolCallError] = useState<string | null>(null);

  const [ragIngestData, setRagIngestData] = useState<RagIngestResponse | null>(null);
  const [ragIngestLoading, setRagIngestLoading] = useState(false);
  const [ragIngestError, setRagIngestError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHealth() {
      setHealthLoading(true);
      setHealthError(null);
      try {
        const result = await fetchHealth();
        if (!cancelled) {
          setHealth(result);
        }
      } catch (error) {
        if (!cancelled) {
          setHealthError(error instanceof Error ? error.message : "健康检查失败");
        }
      } finally {
        if (!cancelled) {
          setHealthLoading(false);
        }
      }
    }

    void loadHealth();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handlePing(message: string) {
    setPingLoading(true);
    setPingError(null);

    try {
      const result = await pingAi(message);
      setPingData(result);
    } catch (error) {
      setPingError(error instanceof Error ? error.message : "AI 连通性请求失败");
    } finally {
      setPingLoading(false);
    }
  }

  async function handleSummary(text: string) {
    setSummaryLoading(true);
    setSummaryError(null);

    try {
      const result = await summarizeText(text);
      setSummaryData(result);
    } catch (error) {
      setSummaryError(error instanceof Error ? error.message : "文本总结请求失败");
    } finally {
      setSummaryLoading(false);
    }
  }

  async function handleExtract(text: string) {
    setExtractLoading(true);
    setExtractError(null);

    try {
      const result = await extractText(text);
      setExtractData(result);
    } catch (error) {
      setExtractError(error instanceof Error ? error.message : "结构化抽取请求失败");
    } finally {
      setExtractLoading(false);
    }
  }

  async function handleToolCall(question: string) {
    setToolCallLoading(true);
    setToolCallError(null);

    try {
      const result = await callWeatherTool(question);
      setToolCallData(result);
    } catch (error) {
      setToolCallError(error instanceof Error ? error.message : "天气工具调用请求失败");
    } finally {
      setToolCallLoading(false);
    }
  }

  /**
   * 触发 Day 9 RAG 文档导入。
   *
   * 前端只负责调用接口并展示结果，不在浏览器里解析 Markdown；
   * 这样可以保持“后端负责知识库导入，前端负责操作与观察”的职责边界。
   */
  async function handleRagIngest() {
    setRagIngestLoading(true);
    setRagIngestError(null);

    try {
      const result = await ingestRagDocuments();
      setRagIngestData(result);
    } catch (error) {
      setRagIngestError(error instanceof Error ? error.message : "RAG 文档导入请求失败");
    } finally {
      setRagIngestLoading(false);
    }
  }

  const activeMenu = capabilityMenus.find((item) => item.key === activeCapability) ?? capabilityMenus[0];

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Knowledge RAG Demo</p>
          <h1>AI 能力工作台</h1>
          <p className="hero-copy">
            这个工作台用于承接当前学习阶段的 AI 能力验证，包括模型连通性、文本总结、结构化抽取、Tool Calling
            和后续 RAG 问答能力。页面组织方式尽量贴近企业内部 AI 控制台，便于继续扩展 Day 5 / Day 6。
          </p>
        </div>
        <HealthBadge data={health} loading={healthLoading} error={healthError} />
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
          <CapabilityCard kicker={activeMenu.kicker} title={activeMenu.title} description={activeMenu.description}>
            {activeCapability === "ping" ? (
              <>
                <PingPanel onSubmit={handlePing} loading={pingLoading} />
                <AnswerPreviewCard
                  title="AI 连通性返回结果"
                  emptyTitle="还没有连通性结果"
                  emptyDescription="先发送一段消息，验证当前模型接入链路是否工作正常。"
                  answer={pingData?.output ?? null}
                  meta={
                    pingData
                      ? [
                          { label: "Provider", value: pingData.provider },
                          { label: "Input", value: pingData.input }
                        ]
                      : []
                  }
                  loading={pingLoading}
                />
                <StatusNotice tone="error" message={pingError} />
              </>
            ) : null}

            {activeCapability === "summary" ? (
              <>
                <SummaryPanel onSubmit={handleSummary} loading={summaryLoading} />
                <AnswerPreviewCard
                  title="文本总结结果"
                  emptyTitle="还没有总结结果"
                  emptyDescription="发送一段文本到 /ai/summary，这里会展示总结结果和基础元信息。"
                  answer={summaryData?.summary ?? null}
                  meta={
                    summaryData
                      ? [
                          { label: "Original Length", value: String(summaryData.originalLength) },
                          { label: "Truncated", value: String(summaryData.truncated) }
                        ]
                      : []
                  }
                  loading={summaryLoading}
                />
                <StatusNotice tone="error" message={summaryError} />
              </>
            ) : null}

            {activeCapability === "extract" ? (
              <>
                <ExtractPanel onSubmit={handleExtract} loading={extractLoading} />
                <ExtractResultCard data={extractData} loading={extractLoading} />
                <StatusNotice tone="error" message={extractError} />
                <StatusNotice
                  tone="info"
                  message="推荐用故障反馈、需求描述、投诉记录和咨询文本来观察结构化抽取效果。"
                />
              </>
            ) : null}

            {activeCapability === "toolCalling" ? (
              <>
                <WeatherToolPanel onSubmit={handleToolCall} loading={toolCallLoading} />
                <WeatherToolResultCard data={toolCallData} loading={toolCallLoading} />
                <StatusNotice tone="error" message={toolCallError} />
                <StatusNotice
                  tone="info"
                  message="你可以试试“北京今天天气怎么样”或“介绍一下这个项目”，对比是否真的触发了工具。"
                />
              </>
            ) : null}

            {activeCapability === "ragIngest" ? (
              <>
                <RagIngestionPanel data={ragIngestData} loading={ragIngestLoading} onIngest={handleRagIngest} />
                <StatusNotice tone="error" message={ragIngestError} />
                <StatusNotice
                  tone="info"
                  message="如果这里提示目录不存在，请先确认后端已重启，并加载了兼容父级工作区启动的路径解析代码。"
                />
              </>
            ) : null}

            {activeCapability === "ragRoadmap" ? (
              <>
                <RagQuestionPanel />
                <AnswerPreviewCard
                  title="RAG 答案预览"
                  emptyTitle="RAG 接口还未接入"
                  emptyDescription="等 /rag/ask 和 /rag/search 准备好后，这里可以直接展示最终答案和上下文信息。"
                  answer={null}
                  meta={[
                    { label: "Status", value: "placeholder" },
                    { label: "Next", value: "wire to /rag/ask" }
                  ]}
                  loading={false}
                />
                <CitationPreviewList items={previewCitations} />
                <StatusNotice tone="info" message="当前引用列表是静态预览，目标是先把 RAG 卡片的布局稳定下来。" />
              </>
            ) : null}
          </CapabilityCard>
        </section>
      </main>
    </div>
  );
}

export default App;
