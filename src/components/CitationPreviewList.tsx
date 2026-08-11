import { type RagSearchResult } from "../types/api";

type CitationPreviewListProps = {
  items: RagSearchResult[];
};

export function CitationPreviewList({ items }: CitationPreviewListProps) {
  return (
    <div className="citation-block">
      <div className="answer-card__header">
        <h3>引用预览</h3>
      </div>
      <ul className="citation-list">
        {items.map((item) => (
          <li key={`${item.fileName}-${item.chunkIndex}`} className="citation-item">
            <div className="citation-meta">
              <strong>{item.fileName}</strong>
              <span>chunk #{item.chunkIndex}</span>
            </div>
            <p>{item.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
