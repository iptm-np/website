import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { Search, ArrowUpDown } from 'lucide-react';
import {
  PortfolioItem,
  PortfolioFilters,
  PortfolioSortKey,
  PortfolioSortOrder,
} from '../../../types/portfolio.types';
import {
  filterPortfolioItems,
  sortPortfolioItems,
  getUniqueFilterValues,
  formatContractAmount,
} from '../../../services/portfolio.service';

interface PortfolioTableProps {
  items: PortfolioItem[];
  title?: string;
  showTypeFilter?: boolean;
  allowedTypes?: ('project' | 'consulting' | 'training')[];
}

export function PortfolioTable({
  items,
  title = 'Portfolio',
  showTypeFilter = true,
  allowedTypes,
}: PortfolioTableProps) {
  const [filters, setFilters] = useState<PortfolioFilters>({
    type: showTypeFilter ? 'all' : allowedTypes?.[0],
    sector: undefined,
    client: undefined,
    fiscalYear: undefined,
    search: '',
  });

  const [sortKey, setSortKey] = useState<PortfolioSortKey>('fiscalYear');
  const [sortOrder, setSortOrder] = useState<PortfolioSortOrder>('desc');

  // Filter items by allowed types
  const visibleItems = useMemo(() => {
    if (!allowedTypes) return items;
    return items.filter((item) => allowedTypes.includes(item.type));
  }, [items, allowedTypes]);

  // Get unique filter values
  const filterValues = useMemo(() => getUniqueFilterValues(visibleItems), [visibleItems]);

  // Apply filters and sorting
  const filteredItems = useMemo(() => {
    const filtered = filterPortfolioItems(visibleItems, filters);
    return sortPortfolioItems(filtered, sortKey, sortOrder);
  }, [visibleItems, filters, sortKey, sortOrder]);

  const handleSort = (key: PortfolioSortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setFilters({
      type: showTypeFilter ? 'all' : allowedTypes?.[0],
      sector: undefined,
      client: undefined,
      fiscalYear: undefined,
      search: '',
    });
  };

  const getItemLink = (item: PortfolioItem) => {
    switch (item.type) {
      case 'project':
        return `/projects/${item.slug}`;
      case 'consulting':
        return `/consulting/${item.slug}`;
      case 'training':
        return `/events/${item.slug}`;
      default:
        return '#';
    }
  };

  const getTypeBadge = (type: string) => {
    const badges = {
      project: 'bg-blue-100 text-blue-700',
      consulting: 'bg-green-100 text-green-700',
      training: 'bg-purple-100 text-purple-700',
    };
    return badges[type as keyof typeof badges] || 'bg-gray-100 text-gray-700';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      project: 'Project',
      consulting: 'Consulting',
      training: 'Training/Event',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by title, client, or sector..."
                value={filters.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10"
              />
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {showTypeFilter && (
                <Select
                  value={filters.type || 'all'}
                  onValueChange={(value: any) => setFilters({ ...filters, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="project">Projects</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="training">Training/Events</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Select
                value={filters.sector || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, sector: value === 'all' ? undefined : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sectors</SelectItem>
                  {filterValues.sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.client || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, client: value === 'all' ? undefined : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Clients</SelectItem>
                  {filterValues.clients.map((client) => (
                    <SelectItem key={client} value={client}>
                      {client}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filters.fiscalYear || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, fiscalYear: value === 'all' ? undefined : value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Fiscal Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {filterValues.fiscalYears.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Summary and Clear */}
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {filteredItems.length} of {visibleItems.length} items
              </p>
              {(filters.search ||
                filters.type !== (showTypeFilter ? 'all' : allowedTypes?.[0]) ||
                filters.sector ||
                filters.client ||
                filters.fiscalYear) && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('title')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Assignment
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('fiscalYear')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Fiscal Year
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('contractAmount')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Contract Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('client')}
                      className="flex items-center gap-1 hover:text-gray-700"
                    >
                      Client
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partner Firms
                  </th>
                  {showTypeFilter && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={showTypeFilter ? 7 : 6}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No items found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, index) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link to={getItemLink(item)} className="hover:text-brand-600 font-medium">
                          {item.title}
                        </Link>
                        <p className="text-xs text-gray-500 mt-1">{item.sector}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.fiscalYear || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatContractAmount(item.contractAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.client || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.partnerFirms || '—'}
                      </td>
                      {showTypeFilter && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadge(
                              item.type
                            )}`}
                          >
                            {getTypeLabel(item.type)}
                          </span>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}