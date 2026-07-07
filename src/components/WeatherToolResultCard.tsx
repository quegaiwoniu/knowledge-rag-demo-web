import { type ToolCallResponse } from "../types/api";

type WeatherToolResultCardProps = {
  data: ToolCallResponse | null;
  loading: boolean;
};

/**
 * 天气 Tool Calling 的结果展示卡片。
 *
 * 这里同时展示两层信息：
 * 1. 模型最终回答；
 * 2. 工具调用的结构化结果，方便你对照后端返回字段阅读代码。
 */
export function WeatherToolResultCard({ data, loading }: WeatherToolResultCardProps) {
  if (loading) {
    return (
      <div className="answer-card">
        <div className="placeholder-block">正在调用工具并组织回答，我们马上回来。</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="answer-card">
        <div className="empty-card">
          <h4>还没有天气工具结果</h4>
          <p>发送一个天气问题到 /ai/tool-call，这里会展示模型回答、是否调用工具，以及工具返回的天气数据。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="answer-card">
      <div className="answer-card__header">
        <h3>Tool Calling 返回结果</h3>
      </div>

      <p className="answer-text">{data.answer}</p>

      <div className="meta-grid">
        <div className="meta-card">
          <span className="meta-label">是否调用工具</span>
          <strong>{data.toolCalled ? "是" : "否"}</strong>
        </div>
        <div className="meta-card">
          <span className="meta-label">工具名</span>
          <strong>{data.toolName ?? "未调用"}</strong>
        </div>
        <div className="meta-card">
          <span className="meta-label">数据源</span>
          <strong>{data.toolSource ?? "无"}</strong>
        </div>
      </div>

      {data.toolResult ? (
        <div className="weather-result">
          <div className="weather-result__header">
            <span className="weather-badge">{data.toolResult.location}</span>
            <strong>{data.toolResult.condition}</strong>
          </div>
          <div className="meta-grid">
            <div className="meta-card">
              <span className="meta-label">温度</span>
              <strong>{data.toolResult.temperatureCelsius}℃</strong>
            </div>
            <div className="meta-card">
              <span className="meta-label">湿度</span>
              <strong>{data.toolResult.humidityPercent}%</strong>
            </div>
            <div className="meta-card">
              <span className="meta-label">风向</span>
              <strong>{data.toolResult.windDirection}</strong>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
