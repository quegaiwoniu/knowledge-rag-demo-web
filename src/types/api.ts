export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
};

export type HealthResponse = {
  status: string;
  application: string;
};

export type AiPingResponse = {
  provider: string;
  input: string;
  output: string;
};

export type SummaryResponse = {
  summary: string;
  originalLength: number;
  truncated: boolean;
};

export type ExtractResponse = {
  title: string;
  category: "BUG" | "FEATURE" | "QUESTION" | "COMPLAINT";
  priority: "LOW" | "MEDIUM" | "HIGH";
  keywords: string[];
};

export type WeatherToolResult = {
  // 后端天气工具返回的结构化天气数据。
  location: string;
  condition: string;
  temperatureCelsius: number;
  humidityPercent: number;
  windDirection: string;
};

export type ToolCallResponse = {
  // 模型最终组织给前端显示的自然语言回答。
  answer: string;
  // 本轮是否真的触发了工具调用。
  toolCalled: boolean;
  toolName: string | null;
  // 标识本轮工具结果来自 mock 还是真实 provider。
  toolSource: string | null;
  toolResult: WeatherToolResult | null;
};

export type CitationPreview = {
  fileName: string;
  chunkIndex: number;
  snippet: string;
};
