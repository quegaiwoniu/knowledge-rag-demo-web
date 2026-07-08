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

export type RagDocumentMetadata = {
  // 后端根据内容哈希生成的稳定文档 ID，后续可用于 chunk 与引用追踪。
  docId: string;
  // Markdown 文件名，例如 order-status-definition.md。
  fileName: string;
  // 文档来源路径，后续展示引用来源时会用到。
  sourcePath: string;
  // 从 Markdown 一级标题解析出来的业务标题。
  title: string;
  // 文档内容 SHA-256，用于识别重复文档或判断内容是否变化。
  contentHash: string;
  // 本次导入时间，用于判断知识库刷新时间。
  ingestedAt: string;
};

export type RagIngestResponse = {
  // 本次真正导入的文档数量。
  importedCount: number;
  // 因 contentHash 重复而被跳过的文档数量。
  duplicateCount: number;
  // 导入后的文档元数据列表。
  documents: RagDocumentMetadata[];
};
