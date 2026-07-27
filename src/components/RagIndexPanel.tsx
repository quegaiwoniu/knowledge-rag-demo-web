import { useState } from "react";
import { type RagIndexStatusResponse } from "../types/api";

type RagIndexPanelProps = {
  data: RagIndexStatusResponse | null;
  loading: boolean;
  rebuilding: boolean;
  onRebuild: () => Promise<unknown>;
  onRefresh: () => Promise<unknown>;
};

/**
 * RAG 索引重建与状态面板。
 *
 * Day 11 新增：
 * 1. 触发索引重建（导入 → 切片 → 向量化 → pgvector 入库）
 * 2. 查看索引状态（文档数、chunk 数、向量化数、最后重建时间）
 */
export function RagIndexPanel({
  data,
  loading,
  rebuilding,
  onRebuild,
  onRefresh,
}: RagIndexPanelProps) {
  const [progress, setProgress] = useState(0);

  const handleRebuild = async () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => Math.min(p + Math.random() * 15, 90));
    }, 800);
    try {
      await onRebuild();
      setProgress(100);
    } finally {
      clearInterval(interval);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  const isLoading = loading || rebuilding;

  return (
    <div className="stack">
      <div className="ingest-intro">
        <p>
          Day 11 新增向量索引能力。点击"重建索引"后，后端会执行完整流水线：
          导入 Markdown → 章节切片 → 调用 embedding 模型 → 写入 pgvector。
        </p>
      </div>

      <div className="actions">
        <button
          className="primary-button"
          type="button"
          disabled={isLoading}
          onClick={() => void handleRebuild()}
        >
          {rebuilding ? "正在重建索引..." : "重建索引 (rebuild)"}
        </button>
        <button
          className="secondary-button"
          type="button"
          disabled={isLoading}
          onClick={() => void onRefresh()}
        >
          刷新状态
        </button>
      </div>

      {rebuilding && progress > 0 && progress < 100 ? (
        <div className="answer-card">
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
            <span className="progress-text">索引重建中... {Math.round(progress)}%</span>
          </div>
          <div className="placeholder-block">
            {progress < 30
              ? "正在导入 Markdown 文档..."
              : progress < 60
                ? "正在执行章节切片..."
                : progress < 90
                  ? "正在调用 embedding 模型向量化..."
                  : "正在写入 pgvector..."}
          </div>
        </div>
      ) : null}

      {loading && !rebuilding ? (
        <div className="answer-card">
          <div className="placeholder-block">正在查询索引状态...</div>
        </div>
      ) : null}

      {!isLoading && !data ? (
        <div className="answer-card">
          <div className="empty-card">
            <h4>还没有索引状态</h4>
            <p>
              点击"重建索引"后，这里会展示文档数、chunk 数、向量化数量和最后重建时间。
            </p>
          </div>
        </div>
      ) : null}

      {!isLoading && data ? (
        <div className="answer-card">
          <div className="answer-card__header">
            <h3>向量索引状态</h3>
          </div>

          <div className="meta-grid">
            <div className="meta-card">
              <span className="meta-label">文档数量</span>
              <strong>{data.documentCount} 篇</strong>
            </div>
            <div className="meta-card">
              <span className="meta-label">Chunk 数量</span>
              <strong>{data.chunkCount} 个</strong>
            </div>
            <div className="meta-card">
              <span className="meta-label">已向量化</span>
              <strong>{data.embeddedChunkCount} 个</strong>
            </div>
            <div className="meta-card">
              <span className="meta-label">索引状态</span>
              <strong>{data.hasIndex ? "✅ 就绪" : "❌ 未构建"}</strong>
            </div>
          </div>

          <div className="meta-grid">
            <div className="meta-card">
              <span className="meta-label">最后重建</span>
              <strong>
                {data.lastRebuildAt
                  ? formatDateTime(data.lastRebuildAt)
                  : "从未"}
              </strong>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}
