import { type ExtractResponse } from "../types/api";

type ExtractResultCardProps = {
  data: ExtractResponse | null;
  loading: boolean;
};

const categoryLabels: Record<ExtractResponse["category"], string> = {
  BUG: "缺陷",
  FEATURE: "需求",
  QUESTION: "咨询",
  COMPLAINT: "投诉"
};

const priorityLabels: Record<ExtractResponse["priority"], string> = {
  LOW: "低",
  MEDIUM: "中",
  HIGH: "高"
};

export function ExtractResultCard({ data, loading }: ExtractResultCardProps) {
  if (loading) {
    return (
      <div className="answer-card">
        <div className="placeholder-block">正在抽取结构化信息，我们马上就回来。</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="answer-card">
        <div className="empty-card">
          <h4>还没有抽取结果</h4>
          <p>发送一段业务文本到 /ai/extract，页面会在这里展示标题、分类、优先级和关键词。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="answer-card">
      <div className="answer-card__header">
        <h3>结构化抽取结果</h3>
      </div>

      <div className="extract-title-block">
        <span className="meta-label">标题</span>
        <p className="extract-title">{data.title}</p>
      </div>

      <div className="meta-grid">
        <div className="meta-card">
          <span className="meta-label">分类</span>
          <strong>{categoryLabels[data.category]}</strong>
        </div>
        <div className="meta-card">
          <span className="meta-label">优先级</span>
          <strong className={`priority-badge priority-badge--${data.priority.toLowerCase()}`}>
            {priorityLabels[data.priority]}
          </strong>
        </div>
      </div>

      <div className="keyword-block">
        <span className="meta-label">关键词</span>
        <div className="tag-list">
          {data.keywords.map((keyword) => (
            <span key={keyword} className="tag-chip">
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
