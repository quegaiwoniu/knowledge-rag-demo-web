/**
 * 最近一次请求 traceId 的轻量全局存储。
 *
 * 后端 TraceIdFilter 会在每个响应头里返回 X-Trace-Id，
 * API 层在每次请求后调用 recordTraceId 保存，
 * UI 通过 useTraceId hook 订阅变化并展示，方便报问题时定位后端日志。
 */

let lastTraceId: string | null = null;
const listeners = new Set<() => void>();

export function recordTraceId(response: Response): void {
  const id = response.headers.get("X-Trace-Id");
  if (id) {
    lastTraceId = id;
    listeners.forEach((listener) => listener());
  }
}

export function getLastTraceId(): string | null {
  return lastTraceId;
}

export function subscribeTraceId(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
