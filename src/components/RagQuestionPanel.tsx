export function RagQuestionPanel() {
  return (
    <div className="stack">
      <label className="field">
        <span className="field-label">RAG Question</span>
        <textarea
          rows={4}
          placeholder="例如：系统启动时报数据库连接失败怎么排查？"
          disabled
        />
      </label>
      <div className="actions">
        <button className="secondary-button" type="button" disabled>
          预留给 /rag/ask
        </button>
      </div>
    </div>
  );
}
