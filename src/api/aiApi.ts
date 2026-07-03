import { getJson } from "./client";
import { type AiPingResponse, type ExtractResponse, type SummaryResponse } from "../types/api";

/**
 * 调用后端 /ai/ping 接口。
 *
 * 作用：
 * 1. 验证前后端是否连通
 * 2. 验证当前模型供应商配置是否可用
 */
export function pingAi(message: string): Promise<AiPingResponse> {
  const encoded = encodeURIComponent(message);
  return getJson<AiPingResponse>(`/ai/ping?message=${encoded}`);
}

/**
 * 调用后端 /ai/summary 接口。
 *
 * 作用：
 * 1. 把用户输入的长文本发送到后端
 * 2. 获取结构化摘要结果
 * 3. 为后续接真实模型或 RAG 能力保留统一调用方式
 */
export async function summarizeText(text: string): Promise<SummaryResponse> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/ai/summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload.data as SummaryResponse;
}

export async function extractText(text: string): Promise<ExtractResponse> {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/ai/extract`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload.data as ExtractResponse;
}
