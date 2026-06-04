import { useEffect, useState } from "react";
import { pingAi, summarizeText } from "./api/aiApi";
import { fetchHealth } from "./api/healthApi";
import { AnswerPreviewCard } from "./components/AnswerPreviewCard";
import { CitationPreviewList } from "./components/CitationPreviewList";
import { HealthBadge } from "./components/HealthBadge";
import { PingPanel } from "./components/PingPanel";
import { RagQuestionPanel } from "./components/RagQuestionPanel";
import { StatusNotice } from "./components/StatusNotice";
import { SummaryPanel } from "./components/SummaryPanel";
import { type AiPingResponse, type CitationPreview, type HealthResponse, type SummaryResponse } from "./types/api";

const previewCitations: CitationPreview[] = [
  {
    fileName: "faq.md",
    chunkIndex: 2,
    snippet: "这里后续会展示 RAG 返回的文档名、分片编号和片段摘要。"
  },
  {
    fileName: "troubleshooting.md",
    chunkIndex: 5,
    snippet: "这个区域已经提前按 /rag/ask 的展示需求留好了结构。"
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
      setPingError(error instanceof Error ? error.message : "AI 调试请求失败");
    } finally {
      setPingLoading(false);
    }
  }

  /**
   * 处理文本总结请求。
   *
   * 这里单独维护 loading 和 error，
   * 这样页面可以同时支持 ping 调试和 summary 调试，而不会互相覆盖状态。
   */
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

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Knowledge RAG Demo</p>
          <h1>最小前端演示页</h1>
          <p className="hero-copy">
            当前页面已经真实接入 <code>/health</code>、<code>/ai/ping</code> 和
            <code>/ai/summary</code>，同时也把后续 RAG 问答区和引用区的布局提前留好了。
          </p>
        </div>
        <HealthBadge data={health} loading={healthLoading} error={healthError} />
      </header>

      <main className="page-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Step 1</p>
              <h2>AI Ping 调试区</h2>
            </div>
          </div>
          <PingPanel onSubmit={handlePing} loading={pingLoading} />
          <AnswerPreviewCard
            title="AI Ping 返回结果"
            emptyTitle="还没有返回结果"
            emptyDescription="先发送一段消息，验证前后端连通性和当前模型供应商配置。"
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
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Step 2</p>
              <h2>文本总结调试区</h2>
            </div>
          </div>
          <SummaryPanel onSubmit={handleSummary} loading={summaryLoading} />
          <AnswerPreviewCard
            title="文本总结结果"
            emptyTitle="还没有总结结果"
            emptyDescription="发送一段文本到 /ai/summary，验证新的总结接口是否工作正常。"
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
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Step 3</p>
              <h2>RAG 区域预留</h2>
            </div>
          </div>
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
          <StatusNotice
            tone="info"
            message="当前引用列表是静态预览，目的是先把页面结构稳定下来。"
          />
        </section>
      </main>
    </div>
  );
}

export default App;
