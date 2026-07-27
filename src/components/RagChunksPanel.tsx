import { type RagChunk, type RagChunksResponse } from "../types/api";

type RagChunksPanelProps = {
  data: RagChunksResponse | null;
  loading: boolean;
  onRefresh: () => Promise<void>;
};

/**
 * RAG 文档切片调试面板。
 *
 * 这个组件对应后端 GET /rag/chunks，主要用于 Day 10 人工检查：
 * 1. chunk 配置是否生效；
 * 2. chunk 顺序是否稳定；
 * 3. 每个 chunk 是否保留可追溯元数据。
 */
export function RagChunksPanel({ data, loading, onRefresh }: RagChunksPanelProps) {
  return (
    <div className="stack">
      <div className="ingest-intro">
        <p>
          当前页面展示最近一次导入后的切片结果。请先执行“知识库文档导入”，再刷新 chunks；
          Day 10 只做可追溯切片，不包含 embedding 和向量检索。
        </p>
      </div>

      <div className="actions">
        <button className="primary-button" type="button" disabled={loading} onClick={() => void onRefresh()}>
          {loading ? "正在读取 chunks..." : "刷新 /rag/chunks"}
        </button>
      </div>

      {loading ? (
        <div className="answer-card">
          <div className="placeholder-block">正在读取后端当前内存中的切片结果。</div>
        </div>
      ) : null}

      {!loading && !data ? (
        <div className="answer-card">
          <div className="empty-card">
            <h4>还没有切片结果</h4>
            <p>先导入知识库文档，再刷新 chunks。这里会展示切片配置、数量和每个 chunk 的追溯信息。</p>
          </div>
        </div>
      ) : null}

      {!loading && data ? (
        <div className="answer-card">
          <div className="answer-card__header">
            <h3>切片调试结果</h3>
          </div>

          <div className="meta-grid">
            <MetricCard label="参与文档" value={`${data.documentCount} 篇`} />
            <MetricCard label="生成 chunks" value={`${data.chunkCount} 个`} />
            <MetricCard label="Chunk Size" value={String(data.chunkSize)} />
            <MetricCard label="Overlap" value={String(data.chunkOverlap)} />
          </div>

          {data.chunks.length > 0 ? (
            <div className="chunk-list">
              {data.chunks.map((chunk) => (
                <ChunkPreview key={`${chunk.docId}-${chunk.chunkIndex}`} chunk={chunk} />
              ))}
            </div>
          ) : (
            <div className="empty-card chunk-empty">
              <h4>当前没有生成 chunk</h4>
              <p>这通常表示还没有导入文档，或者导入的 Markdown 文档内容为空。</p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="meta-card">
      <span className="meta-label">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ChunkPreview({ chunk }: { chunk: RagChunk }) {
  return (
    <article className="chunk-card">
      <div className="chunk-card__header">
        <div>
          <span className="chunk-index">#{chunk.chunkIndex}</span>
          <h4>{chunk.sectionTitle}</h4>
        </div>
        <code>{chunk.fileName}</code>
      </div>

      <p className="chunk-card__content">{chunk.content}</p>

      <div className="chunk-card__meta">
        <span title={chunk.title}>文档：{chunk.title}</span>
        <span title={chunk.docId}>Doc ID：{chunk.docId}</span>
        <span title={chunk.sourcePath}>来源：{chunk.sourcePath}</span>
      </div>
    </article>
  );
}
