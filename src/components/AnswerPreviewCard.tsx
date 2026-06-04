type AnswerPreviewCardProps = {
  title: string;
  emptyTitle: string;
  emptyDescription: string;
  answer: string | null;
  meta: Array<{ label: string; value: string }>;
  loading: boolean;
};

export function AnswerPreviewCard({
  title,
  emptyTitle,
  emptyDescription,
  answer,
  meta,
  loading
}: AnswerPreviewCardProps) {
  return (
    <div className="answer-card">
      <div className="answer-card__header">
        <h3>{title}</h3>
      </div>
      {loading ? (
        <div className="placeholder-block">正在处理中，我们马上就回来。</div>
      ) : answer ? (
        <>
          <p className="answer-text">{answer}</p>
          {meta.length > 0 ? (
            <div className="meta-grid">
              {meta.map((item) => (
                <div key={item.label} className="meta-card">
                  <span className="meta-label">{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <div className="empty-card">
          <h4>{emptyTitle}</h4>
          <p>{emptyDescription}</p>
          {meta.length > 0 ? (
            <div className="meta-grid">
              {meta.map((item) => (
                <div key={item.label} className="meta-card">
                  <span className="meta-label">{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
