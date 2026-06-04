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

export type CitationPreview = {
  fileName: string;
  chunkIndex: number;
  snippet: string;
};
