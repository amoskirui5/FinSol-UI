import { useState, useEffect } from 'react';
import { PaginationResult } from '../types/paginationTypes.ts';



export const usePagination = <T>(
    fetchFunction: (
        pageNumber: number,
        pageSize: number,
        searchTerm?: string,
        searchField?: string
    ) => Promise<{ data: T[]; totalRecords: number }>,
    initialPageNumber: number = 1,
    initialPageSize: number = 10
): PaginationResult<T> => {
    const [data, setData] = useState<T[]>([]);
    const [pageNumber, setPageNumber] = useState<number>(initialPageNumber);
    const [pageSize, setPageSize] = useState<number>(initialPageSize);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
    const [searchField, setSearchField] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await fetchFunction(pageNumber, pageSize, searchTerm, searchField);
                setData(result.data);
                setTotalRecords(result.totalRecords);
                setTotalPages(Math.ceil(result.totalRecords / pageSize));
            } catch (err) {
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [fetchFunction, pageNumber, pageSize, searchTerm, searchField]);

    return {
        data,
        pageNumber,
        pageSize,
        totalPages,
        totalRecords,
        loading,
        error,
        setPageNumber,
        setPageSize,
        setSearchTerm,
        setSearchField,
    };
};
