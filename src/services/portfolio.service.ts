import {
  PortfolioItem,
  PortfolioFilters,
  PortfolioSortKey,
  PortfolioSortOrder,
} from '../types/portfolio.types';

/** Strip HTML tags for plain-text search */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

// ============================================================================
// FILTERING
// ============================================================================

/**
 * Filter portfolio items based on multiple criteria
 */
export function filterPortfolioItems(
  items: PortfolioItem[],
  filters: PortfolioFilters
): PortfolioItem[] {
  return items.filter((item) => {
    // Type filter
    if (filters.type && filters.type !== 'all' && item.type !== filters.type) {
      return false;
    }

    // Sector filter
    if (filters.sector && item.sector !== filters.sector) {
      return false;
    }

    // Client filter (clientId)
    if (filters.client && item.clientId !== filters.client) {
      return false;
    }

    // Fiscal year filter
    if (filters.fiscalYear && item.fiscalYear !== filters.fiscalYear) {
      return false;
    }

    // Search filter (searches in title, description, client, sector)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(searchLower) ||
        stripHtml(item.shortDescription).toLowerCase().includes(searchLower) ||
        stripHtml(item.overview || item.fullDescription || '').toLowerCase().includes(searchLower) ||
        (item.clientId || '').toLowerCase().includes(searchLower) ||
        (item.sector || '').toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    return true;
  });
}

// ============================================================================
// SORTING
// ============================================================================

/**
 * Sort portfolio items by specified key and order
 */
export function sortPortfolioItems(
  items: PortfolioItem[],
  sortKey: PortfolioSortKey,
  sortOrder: PortfolioSortOrder = 'desc'
): PortfolioItem[] {
  const sorted = [...items].sort((a, b) => {
    let comparison = 0;

    switch (sortKey) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'fiscalYear':
        comparison = (a.fiscalYear || '').localeCompare(b.fiscalYear || '');
        break;
        case 'client':
          comparison = (a.clientId || '').localeCompare(b.clientId || '');
          break;
      case 'contractAmount':
        const amountA = parseFloat((a.contractAmount || '').replace(/,/g, '')) || 0;
        const amountB = parseFloat((b.contractAmount || '').replace(/,/g, '')) || 0;
        comparison = amountA - amountB;
        break;
      case 'createdAt':
        comparison =
          new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return sorted;
}

// ============================================================================
// GETTERS
// ============================================================================

/**
 * Get only items of a specific type
 */
export function getItemsByType(
  items: PortfolioItem[],
  type: 'project' | 'consulting' | 'training'
): PortfolioItem[] {
  return items.filter((item) => item.type === type);
}

/**
 * Get a single portfolio item by slug
 */
export function getPortfolioItemBySlug(items: PortfolioItem[], slug: string): PortfolioItem | null {
  return items.find((item) => item.slug === slug) || null;
}

/**
 * Get items by sector
 */
export function getItemsBySector(items: PortfolioItem[], sector: string): PortfolioItem[] {
  return items.filter((item) => item.sector === sector);
}

/**
 * Get items by client
 */
export function getItemsByClient(items: PortfolioItem[], clientId: string): PortfolioItem[] {
  return items.filter((item) => item.clientId === clientId);
}

/**
 * Get items by fiscal year
 */
export function getItemsByFiscalYear(items: PortfolioItem[], fiscalYear: string): PortfolioItem[] {
  return items.filter((item) => item.fiscalYear === fiscalYear);
}

/**
 * Get recent items (useful for "latest" sections)
 */
export function getRecentItems(items: PortfolioItem[], limit: number = 6): PortfolioItem[] {
  return [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

/**
 * Get related items (same type or sector)
 */
export function getRelatedItems(
  items: PortfolioItem[],
  currentItem: PortfolioItem,
  limit: number = 3
): PortfolioItem[] {
  return items
    .filter(
      (item) =>
        item.id !== currentItem.id &&
        (item.type === currentItem.type || item.sector === currentItem.sector)
    )
    .slice(0, limit);
}

// ============================================================================
// UTILITIES FOR FILTER OPTIONS
// ============================================================================

/**
 * Get unique values for filter dropdowns
 */
export function getUniqueFilterValues(items: PortfolioItem[]) {
  const sectors = new Set<string>();
  const clients = new Set<string>();
  const fiscalYears = new Set<string>();

  items.forEach((item) => {
    if (item.sector) sectors.add(item.sector);
    if (item.clientId) clients.add(item.clientId);
    if (item.fiscalYear) fiscalYears.add(item.fiscalYear);
  });

  return {
    sectors: Array.from(sectors).sort(),
    clients: Array.from(clients).sort(),
    fiscalYears: Array.from(fiscalYears).sort((a, b) => b.localeCompare(a)), // Newest first
  };
}

/**
 * Get unique types in portfolio
 */
export function getUniqueTypes(items: PortfolioItem[]): ('project' | 'consulting' | 'training')[] {
  const types = new Set<'project' | 'consulting' | 'training'>();
  items.forEach((item) => types.add(item.type));
  return Array.from(types);
}

/**
 * Get portfolio statistics
 */
export function getPortfolioStats(items: PortfolioItem[]) {
  return {
    totalItems: items.length,
    projects: getItemsByType(items, 'project').length,
    consulting: getItemsByType(items, 'consulting').length,
    training: getItemsByType(items, 'training').length,
    totalContractValue: items.reduce((sum, item) => {
      const amount = parseFloat((item.contractAmount || '').replace(/,/g, '')) || 0;
      return sum + amount;
    }, 0),
  };
}

/**
 * Format contract amount for display
 */
export function formatContractAmount(amount: string): string {
  if (!amount) return '—';
  const num = parseFloat(amount.replace(/,/g, ''));
  if (isNaN(num)) return amount;
  return `NRs. ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
