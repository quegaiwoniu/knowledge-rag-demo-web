import { type ApiResponse, type RagChunksResponse, type RagIndexStatusResponse, type RagIngestResponse } from "../types/api";

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

/**
 * 获取后端当前内存知识库的文档切片结果。
 *
 * Day 10 用这个接口调试 chunk metadata、顺序和正文片段；
 * 这里暂时不涉及 embedding，也不做向量检索。
 */
export async function fetchRagChunks(): Promise<RagChunksResponse> {
  const response = await fetch(`${API_BASE_URL}/rag/chunks`);
  const payload = (await response.json()) as ApiResponse<RagChunksResponse>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload.data;
}

export async function rebuildRagIndex(): Promise<RagIndexStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/rag/index/rebuild`, {
    method: "POST"
  });
  const payload = (await response.json()) as ApiResponse<RagIndexStatusResponse>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload.data;
}

export async function fetchRagIndexStatus(): Promise<RagIndexStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/rag/index/status`);
  const payload = (await response.json()) as ApiResponse<RagIndexStatusResponse>;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload.data;
}
