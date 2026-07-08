import { type ApiResponse, type RagIngestResponse } from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

/**
 * 触发后端 RAG 文档导入接口。
 *
 * 当前 Day 9 只调用 POST /rag/ingest，把 docs/sample-docs 下的 Markdown
 * 读取为文档元数据；不涉及 chunking、embedding 和向量检索。
 */
export async function ingestRagDocuments(): Promise<RagIngestResponse> {
  const response = await fetch(`${API_BASE_URL}/rag/ingest`, {
    method: "POST"
  });

  const payload = (await response.json()) as ApiResponse<RagIngestResponse>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload.data;
}
