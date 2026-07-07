import { useState } from "react";

type WeatherToolPanelProps = {
  onSubmit: (question: string) => Promise<void>;
  loading: boolean;
};

/**
 * 天气 Tool Calling 的输入面板。
 *
 * 这个组件只负责收集用户问题并触发提交，
 * 不处理接口请求细节，方便和展示组件解耦。
 */
export function WeatherToolPanel({ onSubmit, loading }: WeatherToolPanelProps) {
  const [question, setQuestion] = useState("上海今天天气怎么样，适合出门吗？");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(question);
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field-label">天气问题输入</span>
        <textarea
          rows={4}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="比如：北京今天天气怎么样？杭州会下雨吗？"
        />
      </label>
      <div className="actions">
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "正在调用天气工具..." : "发送 /ai/tool-call"}
        </button>
      </div>
    </form>
  );
}
