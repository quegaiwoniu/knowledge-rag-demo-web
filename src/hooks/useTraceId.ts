import { useSyncExternalStore } from "react";
import { getLastTraceId, subscribeTraceId } from "../api/trace";

/**
 * 订阅最近一次请求的 traceId。
 *
 * 每次 API 调用返回 X-Trace-Id 响应头后，组件会自动重渲染展示最新值。
 */
export function useTraceId(): string | null {
  return useSyncExternalStore(subscribeTraceId, getLastTraceId);
}
