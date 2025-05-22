import { useState, useEffect, useCallback, useRef } from 'react';

const useFetch = (fetchFunction, autoFetch = true) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFunction();

            if (isMounted.current) {
                setData(result);
            }

            return result; // ✅ Let the caller use the result
        } catch (err) {
            const errObj = err instanceof Error ? err : new Error('An unknown error occurred');

            if (isMounted.current) {
                setError(errObj);
            }

            throw errObj; // ✅ Let the caller catch it
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, [fetchFunction]);

    const reset = useCallback(() => {
        if (isMounted.current) {
            setData(null);
            setError(null);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [autoFetch, fetchData]);

    return { data, loading, setLoading, error, setError, refetch: fetchData, reset };
};

export default useFetch;
