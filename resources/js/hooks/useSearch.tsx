import { useState } from "react";

export function useSearch<T>(data: T[], searchKeys: (keyof T)[]) {
    const [search, setSearch] = useState("");

    const filteredData = data.filter(item =>
        searchKeys.some(key =>
            String(item[key]).toLowerCase().includes(search.toLowerCase())
        )
    );

    return { search, setSearch, filteredData };
}