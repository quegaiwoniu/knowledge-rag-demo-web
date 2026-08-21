import { getJson } from "./client";
import { recordTraceId } from "./trace";
import {
  type AiPingResponse,
  type ExtractResponse,
  type SummaryResponse,
  type ToolCallResponse
} from "../types/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export function pingAi(message: string): Promise<AiPingResponse> {
  const encoded = encodeURIComponent(message);
  return getJson<AiPingResponse>(`/ai/ping?message=${encoded}`);
}

export async function summarizeText(text: string): Promise<SummaryResponse> {
  const response = await fetch(`${API_BASE_URL}/ai/summary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });

  recordTraceId(response);

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload.data as SummaryResponse;
}

export async function extractText(text: string): Promise<ExtractResponse> {
  const response = await fetch(`${API_BASE_URL}/ai/extract`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  });

  recordTraceId(response);

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload.data as ExtractResponse;
}

export async function callWeatherTool(question: string): Promise<ToolCallResponse> {
  const response = await fetch(`${API_BASE_URL}/ai/tool-call`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ question })
  });

  recordTraceId(response);

  const payload = await response.json();

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload.data as ToolCallResponse;
}
