import { useState, useCallback } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T, P = any>(apiFunction: (params?: P) => Promise<T>) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (params?: P) => {
    setState(prevState => ({ ...prevState, loading: true, error: null }));
    
    try {
      const data = await apiFunction(params);
      setState({ data, loading: false, error: null });
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setState(prevState => ({ ...prevState, loading: false, error: errorMessage }));
      throw err;
    }
  }, [apiFunction]);

  return { ...state, execute };
}