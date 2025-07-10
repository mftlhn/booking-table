import { useState } from "react";

export function usePagination<T>(data: T[], defaultLimit = 10) {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(defaultLimit);

    const maxPage = Math.ceil(data.length / limit);
    const paginatedData = data.slice((page - 1) * limit, page * limit);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= maxPage) {
            setPage(newPage);
        }
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1); // Reset ke halaman pertama saat limit berubah
    };

    return { page, limit, maxPage, paginatedData, handlePageChange, handleLimitChange };
}
