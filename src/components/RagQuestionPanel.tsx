import { useState } from "react";

type RagQuestionPanelProps = {
  onSubmit: (query: string, topK: number) => void;
  loading: boolean;
};

export function RagQuestionPanel({ onSubmit, loading }: RagQuestionPanelProps) {
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState(5);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim().length === 0 || loading) {
      return;
    }
    onSubmit(query.trim(), topK);
  };

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field-label">提问</span>
        <textarea
          rows={4}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="例如：系统启动时抛数据库连接失败怎么排查？"
          disabled={loading}
        />
      </label>
      <label className="field field--inline">
        <span className="field-label">topK</span>
        <input
          type="number"
          min={1}
          max={20}
          value={topK}
          onChange={(event) => setTopK(Number(event.target.value) || 5)}
          disabled={loading}
        />
      </label>
      <div className="actions">
        <button className="primary-button" type="submit" disabled={loading || query.trim().length === 0}>
          {loading ? "正在检索并生成回答…" : "提交问题"}
        </button>
      </div>
    </form>
  );
}
