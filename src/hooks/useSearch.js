import { useMemo, useState } from "react";

export const useSearch = (items = [], searchFields = ["name"]) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;

    return items.filter((item) =>
      searchFields.some((field) =>
        item[field]?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [items, searchTerm, searchFields]);

  return { searchTerm, setSearchTerm, filteredItems };
};
