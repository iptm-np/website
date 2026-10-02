import { useCallback, useMemo, useState } from "react";
import type { PortfolioFiltersState, PortfolioFilterType } from "./PortfolioFilters";

/**
 * Manages PortfolioFilters state.
 * Pass the returned values straight into <PortfolioFilters />.
 */
export function usePortfolioFilters(initial: PortfolioFiltersState = {}) {
  const [filters, setFilters] = useState<PortfolioFiltersState>(initial);

  const updateFilters = useCallback((patch: Partial<PortfolioFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const hasActiveFilters = useMemo(
    () =>
      !!(
        filters.search ||
        (filters.type && filters.type !== "all") ||
        filters.sector ||
        filters.fiscalYear ||
        filters.client
      ),
    [filters],
  );

  return { filters, updateFilters, clearFilters, hasActiveFilters };
}

// ── Filter helpers ────────────────────────────────────────────────────────────

export interface FilterableItem {
  title?: string;
  description?: string;
  type?: PortfolioFilterType;
  sector?: string;
  fiscalYear?: string;
  clientId?: string;
}

/** Returns only the items that match the current filters. */
export function applyPortfolioFilters<T extends FilterableItem>(
  items: T[],
  filters: PortfolioFiltersState,
): T[] {
  return items.filter((item) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = `${item.title ?? ""} ${item.description ?? ""}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (filters.type && filters.type !== "all" && item.type !== filters.type) return false;
    if (filters.sector && item.sector !== filters.sector) return false;
    if (filters.fiscalYear && item.fiscalYear !== filters.fiscalYear) return false;
    if (filters.client && item.clientId !== filters.client) return false;
    return true;
  });
}
