import { useState } from "react";

type PingPanelProps = {
  onSubmit: (message: string) => Promise<void>;
  loading: boolean;
};

export function PingPanel({ onSubmit, loading }: PingPanelProps) {
  const [message, setMessage] = useState("hello from frontend");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(message.trim());
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field-label">Ping Message</span>
        <textarea
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="输入一段消息，测试当前模型接入。"
        />
      </label>
      <div className="actions">
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "请求中..." : "发送 /ai/ping"}
        </button>
      </div>
    </form>
  );
}
