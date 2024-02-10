import { useState, useEffect, useCallback } from "react";
import axios, { AxiosResponse } from "axios";

interface UseAxiosProps<T> {
  url: string;
  initialData?: T | null;
}

interface UseAxiosResult<T> {
  data: T | null;
  loading: boolean;
  error: unknown | null;
  refetch: () => void;
}

const useAxios = <T>({
  url,
  initialData = null,
  keepUpdating = false,
}: {
  url: string;
  initialData?: T | null;
  keepUpdating?: boolean;
}): UseAxiosResult<T> => {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response: AxiosResponse<T> = await axios.get(url);
      setData(response.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
    setInterval(() => {
      if (keepUpdating) fetchData();
    }, 10000);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useAxios;
