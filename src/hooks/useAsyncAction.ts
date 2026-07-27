import { useCallback, useState } from "react";

type AsyncActionState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

/**
 * 通用异步 action hook。
 *
 * 消除了每个 handler 重复的 setLoading/setError/setData 模板代码。
 */
export function useAsyncAction<T>(
  asyncFn: (...args: any[]) => Promise<T>,
  initialData: T | null = null
) {
  const [state, setState] = useState<AsyncActionState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<void> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const result = await asyncFn(...args);
        setState({ data: result, loading: false, error: null });
      } catch (error) {
        const message = error instanceof Error ? error.message : "请求失败";
        setState((prev) => ({ ...prev, loading: false, error: message }));
      }
    },
    [asyncFn]
  );

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  return { ...state, execute, reset };
}
