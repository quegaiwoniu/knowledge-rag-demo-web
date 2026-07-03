import { useState } from "react";

type ExtractPanelProps = {
  onSubmit: (text: string) => Promise<void>;
  loading: boolean;
};

const EXAMPLE_TEXT =
  "支付接口上线后，部分订单提交失败，用户反馈需要优先处理，并检查超时日志和订单状态回写。";

export function ExtractPanel({ onSubmit, loading }: ExtractPanelProps) {
  const [text, setText] = useState(EXAMPLE_TEXT);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(text);
  }

  function fillExample() {
    setText(EXAMPLE_TEXT);
  }

  function clearText() {
    setText("");
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field-label">结构化抽取输入</span>
        <textarea
          rows={6}
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="输入一段业务文本，例如故障反馈、需求描述、客户投诉或问题咨询。"
          disabled={loading}
        />
      </label>

      <div className="actions">
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "正在抽取..." : "发送 /ai/extract"}
        </button>
        <button className="secondary-button" type="button" onClick={fillExample} disabled={loading}>
          填充示例
        </button>
        <button className="secondary-button" type="button" onClick={clearText} disabled={loading}>
          清空文本
        </button>
      </div>
    </form>
  );
}
