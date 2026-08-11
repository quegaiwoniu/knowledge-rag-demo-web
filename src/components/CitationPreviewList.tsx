import { type RagSearchResult } from "../types/api";

type CitationPreviewListProps = {
  items: RagSearchResult[];
  title?: string;
  emptyMessage?: string;
};

export function CitationPreviewList({
  items,
  title = "引用预览",
  emptyMessage = "当前回答没有引用任何知识库片段。",
}: CitationPreviewListProps) {
  return (
    <div className="citation-block">
      <div className="answer-card__header">
        <h3>{title}</h3>
      </div>
      {items.length > 0 ? (
        <ul className="citation-list">
          {items.map((item) => (
            <li key={`${item.docId}-${item.chunkIndex}`} className="citation-item">
              <div className="citation-meta">
                <strong>{item.fileName}</strong>
                <span>
                  chunk #{item.chunkIndex} · score {item.score.toFixed(4)}
                </span>
              </div>
              <p>{item.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-evidence">{emptyMessage}</p>
      )}
    </div>
  );
}
