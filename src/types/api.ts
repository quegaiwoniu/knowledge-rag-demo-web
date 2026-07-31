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

export type RagChunk = {
  // 所属文档 ID，用于从 chunk 追溯回原始 Markdown 文档。
  docId: string;
  // 原始 Markdown 文件名。
  fileName: string;
  // 原始 Markdown 文件路径，便于调试来源。
  sourcePath: string;
  // 文档标题，来自 Markdown 一级标题。
  title: string;
  // chunk 所属章节标题，来自 Markdown 二级到六级标题。
  sectionTitle: string;
  // 当前切片结果中的全局顺序号。
  chunkIndex: number;
  // 当前 chunk 的正文内容。
  content: string;
};

export type RagIndexStatusResponse = {
  documentCount: number;
  chunkCount: number;
  embeddedChunkCount: number;
  lastRebuildAt: string | null;
  hasIndex: boolean;
};

export type RagChunksResponse = {
  // 参与切片的文档数量，空文档也会计入。
  documentCount: number;
  // 实际生成的 chunk 数量。
  chunkCount: number;
  // 后端当前生效的 chunk size 配置。
  chunkSize: number;
  // 后端当前生效的 chunk overlap 配置。
  chunkOverlap: number;
  // 按文档、章节和切片顺序排列的 chunks。
  chunks: RagChunk[];
};

export interface RagSearchResult {
  docId: string;
  fileName: string;
  title: string;
  sectionTitle: string;
  chunkIndex: number;
  content: string;
  score: number;
}

export interface RagSearchResponse {
  query: string;
  results: RagSearchResult[];
}