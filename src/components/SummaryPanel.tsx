import { useState } from "react";

type SummaryPanelProps = {
  onSubmit: (text: string) => Promise<void>;
  loading: boolean;
};

/**
 * 文本总结输入面板。
 *
 * 作用：
 * 1. 收集用户要总结的文本
 * 2. 触发 /ai/summary 请求
 * 3. 为后续扩展真实 RAG 问答区保留一致的交互节奏
 */
export function SummaryPanel({ onSubmit, loading }: SummaryPanelProps) {
  const [text, setText] = useState(
    "Spring AI helps Java teams add model capabilities with consistent abstractions, clear layering, and easier provider switching."
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(text);
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field-label">文本总结输入</span>
        <textarea
          rows={6}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="输入一段需要总结的文本。"
        />
      </label>
      <div className="actions">
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "总结中..." : "发送 /ai/summary"}
        </button>
      </div>
    </form>
  );
}
