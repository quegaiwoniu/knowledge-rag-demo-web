import { useState } from "react";
import { type RagSearchResponse, type RagSearchResult } from "../types/api";

type RagSearchPanelProps = {
  onSearch: (query: string, topK: number) => Promise<void>;
  loading: boolean;
  error: string | null;
  data: RagSearchResponse | null;
};

const EXAMPLE_QUESTIONS = [
  "订单超时未发货应该怎么处理？",
  "支付成功后订单状态没有更新怎么办？",
  "退款失败如何处理？",
  "重复支付了怎么处理？",
  "发票开具的规则是什么？",
  "客户付了钱但系统没反应",
  "钱扣了两次怎么办？",
  "如何申请优惠券？",
];

const TOP_K_OPTIONS = [3, 5, 10] as const;

/**
 * RAG 向量检索面板。
 *
 * 对应后端 GET /rag/index/search，用于 Day 12 验证 pgvector 召回。
 * 1. 输入自然语言问题，选择 topK 数量
 * 2. 展示召回的文档片段及其文件名、章节、编号和内容摘要
 */
export function RagSearchPanel({
  onSearch,
  loading,
  error,
  data,
}: RagSearchPanelProps) {
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState<number>(5);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }
    await onSearch(query.trim(), topK);
  }

  return (
    <div className="stack">
      <div className="ingest-intro">
        <p>
          输入自然语言问题，后端会调用 embedding 模型将问题向量化，再从 pgvector
          召回最相似的文档片段。这里用于验证向量检索的准确性和召回内容的可追溯性。
        </p>
      </div>

      <div className="example-questions">
        <span className="example-label">试试这些问题：</span>
        <div className="example-tags">
          {EXAMPLE_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              className="example-tag"
              onClick={() => setQuery(q)}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <form className="stack" onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">检索问题</span>
          <textarea
            rows={3}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="例如：订单超时未发货应该怎么处理？"
            disabled={loading}
          />
        </label>

        <label className="field">
          <span className="field-label">召回数量 (topK)</span>
          <select
            value={topK}
            onChange={(event) => setTopK(Number(event.target.value))}
            disabled={loading}
          >
            {TOP_K_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="actions">
          <button className="primary-button" type="submit" disabled={loading || !query.trim()}>
            {loading ? "正在检索..." : "向量检索"}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="answer-card">
          <div className="placeholder-block">正在调用 embedding 模型并从 pgvector 召回文档片段...</div>
        </div>
      ) : null}

      {!loading && error ? (
        <div className="answer-card">
          <div className="empty-card">
            <h4>检索失败</h4>
            <p>{error}</p>
          </div>
        </div>
      ) : null}

      {!loading && !error && !data ? (
        <div className="answer-card">
          <div className="empty-card">
            <h4>还没有检索结果</h4>
            <p>输入问题并点击检索，这里会展示从 pgvector 召回的文档片段和相关性评分。</p>
          </div>
        </div>
      ) : null}

      {!loading && !error && data ? (
        <div className="answer-card">
          <div className="answer-card__header">
            <h3>检索结果</h3>
            <p className="meta-label">
              查询：{data.query} · 召回 {data.results.length} 条
            </p>
          </div>

          {data.results.length > 0 ? (
            <div className="chunk-list">
              {data.results.map((result) => (
                <SearchResultCard
                  key={`${result.docId}-${result.chunkIndex}`}
                  result={result}
                />
              ))}
            </div>
          ) : (
            <div className="empty-card chunk-empty">
              <h4>没有召回结果</h4>
              <p>当前知识库可能为空，请先执行文档导入和索引重建。</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function SearchResultCard({ result }: { result: RagSearchResult }) {
  return (
    <article className="chunk-card">
      <div className="chunk-card__header">
        <div>
          <span className="chunk-index">#{result.chunkIndex}</span>
          <h4>{result.sectionTitle}</h4>
        </div>
        <code>{result.fileName}</code>
      </div>

      <p className="chunk-card__content">{result.content}</p>

      <div className="chunk-card__meta">
        <span title={result.title}>文档：{result.title}</span>
        <span title={result.docId}>Doc ID：{result.docId}</span>
        <span>相关性评分：{result.score.toFixed(4)}</span>
      </div>
    </article>
  );
}
