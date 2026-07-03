import { useEffect, useState } from "react";
import { extractText, pingAi, summarizeText } from "./api/aiApi";
import { fetchHealth } from "./api/healthApi";
import { AnswerPreviewCard } from "./components/AnswerPreviewCard";
import { CapabilityCard } from "./components/CapabilityCard";
import { CitationPreviewList } from "./components/CitationPreviewList";
import { ExtractPanel } from "./components/ExtractPanel";
import { ExtractResultCard } from "./components/ExtractResultCard";
import { HealthBadge } from "./components/HealthBadge";
import { PingPanel } from "./components/PingPanel";
import { RagQuestionPanel } from "./components/RagQuestionPanel";
import { StatusNotice } from "./components/StatusNotice";
import { SummaryPanel } from "./components/SummaryPanel";
import {
  type AiPingResponse,
  type CitationPreview,
  type ExtractResponse,
  type HealthResponse,
  type SummaryResponse
} from "./types/api";

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

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Knowledge RAG Demo</p>
          <h1>AI 能力工作台</h1>
          <p className="hero-copy">
            这个工作台用于承接当前学习阶段的 AI 能力验证，包括模型连通性、文本总结、结构化抽取和后续
            RAG 问答能力。页面组织方式尽量贴近企业内部 AI 控制台，便于继续扩展 Day 5 / Day 6。
          </p>
        </div>
        <HealthBadge data={health} loading={healthLoading} error={healthError} />
      </header>

      <main className="page-grid">
        <CapabilityCard
          kicker="Connectivity"
          title="AI 连通性验证"
          description="用于快速验证前后端是否连通、模型供应商配置是否可用，是后续所有 AI 能力卡的基础检查项。"
        >
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
        </CapabilityCard>

        <CapabilityCard
          kicker="Summarization"
          title="文本总结"
          description="把较长文本压缩成便于快速阅读的总结结果，用于演示基础文本理解能力和接口边界行为。"
        >
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
        </CapabilityCard>

        <CapabilityCard
          kicker="Structured Extraction"
          title="结构化抽取"
          description="把业务文本治理成可消费的标题、分类、优先级和关键词，贴近企业后台里的文本预处理场景。"
        >
          <ExtractPanel onSubmit={handleExtract} loading={extractLoading} />
          <ExtractResultCard data={extractData} loading={extractLoading} />
          <StatusNotice tone="error" message={extractError} />
          <StatusNotice
            tone="info"
            message="推荐用故障反馈、需求描述、投诉记录和咨询文本来观察结构化抽取效果。"
          />
        </CapabilityCard>

        <CapabilityCard
          kicker="RAG Roadmap"
          title="RAG 能力预留"
          description="当前先稳定工作台骨架和引用展示区域，等 /rag/ask 与检索能力接入后，这张卡可以直接承接真实问答链路。"
        >
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
        </CapabilityCard>
      </main>
    </div>
  );
}

export default App;
