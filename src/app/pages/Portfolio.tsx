import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarClock,
  GraduationCap,
  Users,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useContent } from '../contexts/ContentContext';
import {
  PortfolioFiltersState,
  PortfolioItem,
  PortfolioType,
} from '../../types/portfolio.types';
import {
  filterPortfolioItems,
  getUniqueFilterValues,
} from '../../services/portfolio.service';
import { slugify } from '../../utils/slug';
import { PortfolioFilters as PortfolioFiltersComponent } from '../components/portfolio/PortfolioFilters';
import { PageHeroBackground } from '../components/PageHeroBackground';

const PAGE_SIZE = 10;
const COMPANY_START_BS_YEAR = 2072;
const NEPALI_NEW_YEAR_MONTH_INDEX = 3;
const NEPALI_NEW_YEAR_DAY = 14;

const categoryLabels: Record<PortfolioType, string> = {
  project: 'Project',
  consulting: 'Consulting',
  training: 'Training',
};

const categoryStyles: Record<PortfolioType, string> = {
  project: 'bg-blue-50 text-blue-700 ring-blue-100',
  consulting: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  training: 'bg-violet-50 text-violet-700 ring-violet-100',
};

function getItemLink(item: PortfolioItem) {
  switch (item.type) {
    case 'project':
      return `/projects/${item.slug}`;
    case 'consulting':
      return `/consulting/${item.slug}`;
    case 'training':
      return `/training/${item.slug}`;
    default:
      return '/portfolio';
  }
}

function getFiscalYearSortValue(year?: string) {
  return year || '0000';
}

function getCurrentBsYear(date = new Date()) {
  const hasReachedNepaliNewYear =
    date.getMonth() > NEPALI_NEW_YEAR_MONTH_INDEX ||
    (date.getMonth() === NEPALI_NEW_YEAR_MONTH_INDEX && date.getDate() >= NEPALI_NEW_YEAR_DAY);

  return date.getFullYear() + (hasReachedNepaliNewYear ? 57 : 56);
}

function escapeCsvValue(value?: string | number | boolean) {
  const text = value === undefined || value === null ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function getPortfolioCsv(items: PortfolioItem[], clients: { id: string; name: string }[]) {
  const headers = ['S.N', 'Work', 'Type', 'Fiscal Year', 'Client', 'Sector', 'Partner Firms'];

  const rows = items.map((item, index) => [
    index + 1,
    item.title,
    categoryLabels[item.type],
    item.fiscalYear,
    clients.find((c) => c.id === item.clientId)?.name || '',
    item.sector,
    item.partnerFirms,
  ]);

  return [headers, ...rows]
    .map((row) => row.map((value) => escapeCsvValue(value)).join(','))
    .join('\r\n');
}

export function Portfolio() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedClientParam = searchParams.get('client') || undefined;
  const selectedSectorParam = searchParams.get('sector') || undefined;
  const { portfolio, clients, sectors, pageHeroImages } = useContent();
  const [page, setPage] = useState(1);
  const [fySortOrder, setFySortOrder] = useState<'desc' | 'asc'>('desc');
  const [filters, setFilters] = useState<PortfolioFiltersState>({
    type: 'all',
    sector: undefined,
    fiscalYear: undefined,
    client: undefined,
    search: '',
  });


  const filterValues = useMemo(() => getUniqueFilterValues(portfolio), [portfolio]);

  const selectedClientId = useMemo(() => {
    if (!selectedClientParam) return undefined;

    const client = clients.find(
      (item) =>
        item.id === selectedClientParam ||
        item.slug === selectedClientParam ||
        slugify(item.name) === selectedClientParam
    );

    return client?.id || selectedClientParam;
  }, [clients, selectedClientParam]);

  const selectedSector = useMemo(() => {
    if (!selectedSectorParam) return undefined;

    const savedSector = sectors.find(
      (sector) =>
        sector.name === selectedSectorParam ||
        sector.slug === selectedSectorParam ||
        slugify(sector.name) === selectedSectorParam
    );

    if (savedSector) return savedSector.name;

    const portfolioSector = filterValues.sectors.find(
      (sector) => sector === selectedSectorParam || slugify(sector) === selectedSectorParam
    );

    return portfolioSector || selectedSectorParam;
  }, [filterValues.sectors, sectors, selectedSectorParam]);

  useEffect(() => {
    setFilters((current) => ({
      ...current,
      client: selectedClientId,
      sector: selectedSector,
    }));
    setPage(1);
  }, [selectedClientId, selectedSector]);

  const filteredItems = useMemo(() => {
    const filtered = filterPortfolioItems(portfolio, filters);

    return [...filtered].sort((a, b) => {
      const yearA = getFiscalYearSortValue(a.fiscalYear);
      const yearB = getFiscalYearSortValue(b.fiscalYear);

      return fySortOrder === 'desc'
        ? yearB.localeCompare(yearA)
        : yearA.localeCompare(yearB);
    });
  }, [portfolio, filters, fySortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const visibleItems = filteredItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const yearsOfExperience = getCurrentBsYear() - COMPANY_START_BS_YEAR;

  const stats = useMemo(() => {
    const projects = portfolio.filter((item) => item.type === 'project').length;
    const consultingServices = portfolio.filter((item) => item.type === 'consulting').length;
    const trainingPrograms = portfolio.filter((item) => item.type === 'training').length;

    return [
      { label: 'Projects', value: `${projects}+`, icon: BriefcaseBusiness },
      { label: 'Consulting Services', value: `${consultingServices}+`, icon: Users },
      { label: 'Training Programs', value: `${trainingPrograms}+`, icon: GraduationCap },
      { label: 'Years of Experience', value: `${yearsOfExperience}+`, icon: CalendarClock },
    ];
  }, [portfolio]);

  const updateFilters = (updates: Partial<PortfolioFiltersState>) => {
    if (Object.prototype.hasOwnProperty.call(updates, 'client')) {
      const nextParams = new URLSearchParams(searchParams);

      if (updates.client) {
        const client = clients.find((item) => item.id === updates.client);
        nextParams.set('client', client?.slug || slugify(client?.name || updates.client));
      } else {
        nextParams.delete('client');
      }

      setSearchParams(nextParams, { replace: true });
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'sector')) {
      const nextParams = new URLSearchParams(searchParams);

      if (updates.sector) {
        const sector = sectors.find((item) => item.name === updates.sector);
        nextParams.set('sector', sector?.slug || slugify(updates.sector));
      } else {
        nextParams.delete('sector');
      }

      setSearchParams(nextParams, { replace: true });
    }

    setFilters((current) => ({ ...current, ...updates }));
    setPage(1);
  };

  const clearFilters = () => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete('client');
    nextParams.delete('sector');
    setSearchParams(nextParams, { replace: true });

    setFilters({
      type: 'all',
      sector: undefined,
      fiscalYear: undefined,
      client: undefined,
      search: '',
    });
    setPage(1);
  };

  const hasActiveFilters =
    filters.type !== 'all' ||
    Boolean(filters.sector) ||
    Boolean(filters.fiscalYear) ||
    Boolean(filters.client) ||
    Boolean(filters.search);

  const handleRowClick = (item: PortfolioItem) => {
    navigate(getItemLink(item));
  };

  const handleDownloadCsv = () => {
    const csv = getPortfolioCsv(filteredItems, clients);
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'iptmNepal-portfolio.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isEmpty = filteredItems.length === 0;

  return (
    <div className="bg-slate-50">
      

      <PageHeroBackground
      image={pageHeroImages?.['portfolio']  || ""}
              fallbackClassName="relative bg-gradient-to-r from-brand-500 to-brand-700 text-white"
            >
             
              <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full py-16">
                <h1 className="text-4xl font-bold mb-4">Our Portfolio</h1>
                <p className="text-xl text-brand-50 max-w-3xl">
                 {yearsOfExperience}+ Years of Engineering Consultancy, Infrastructure Development,
              Project Management, and Capacity-Building Experience Across Nepal.
                </p>
              </div>
              
            </PageHeroBackground>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          ))}
        </section>

        <PortfolioFiltersComponent
          filters={filters}
          filterValues={filterValues}
          clients={clients}
          pagination={{
            visibleCount: visibleItems.length,
            filteredCount: filteredItems.length,
            page,
            totalPages,
            itemLabel: 'assignments',
          }}
          hasActiveFilters={hasActiveFilters}
          isEmpty={isEmpty}
          onUpdateFilters={updateFilters}
          onClearFilters={clearFilters}
          onDownloadCsv={handleDownloadCsv}
        />

        <section className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    S.N
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Work
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Type
                  </th>
                  <th
                    onClick={() => setFySortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
                    className="cursor-pointer px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      Fiscal Year
                      {fySortOrder === 'desc' ? (
                        <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUp className="h-3 w-3" />
                      )}
                    </div>
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                    Partner Firms
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                      No portfolio items match the selected filters.
                    </td>
                  </tr>
                ) : (
                  visibleItems.map((item, index) => (
                    <tr
                      key={item.id}
                      onClick={() => handleRowClick(item)}
                      className="cursor-pointer transition-colors hover:bg-cyan-50/60"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                        {(page - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-950">{item.title}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${categoryStyles[item.type]}`}
                        >
                          {categoryLabels[item.type]}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-700">
                        {item.fiscalYear || '-'}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">
                        {clients.find((c) => c.id === item.clientId)?.name || '-'}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">{item.sector || '-'}</td>
                      <td className="px-5 py-4 text-sm text-slate-700">
                        {item.partnerFirms || '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-4 md:hidden">
            {visibleItems.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">
                No portfolio items match the selected filters.
              </div>
            ) : (
              visibleItems.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleRowClick(item)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-cyan-200 hover:bg-cyan-50/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        SN {(page - 1) * PAGE_SIZE + index + 1}
                      </div>
                      <h3 className="mt-1 font-semibold text-slate-950">{item.title}</h3>
                    </div>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400" />
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-500">Type</p>
                      <p className="font-medium text-slate-900">{categoryLabels[item.type]}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Fiscal Year</p>
                      <p className="font-medium text-slate-900">{item.fiscalYear || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Client</p>
                      <p className="font-medium text-slate-900">
                        {clients.find((c) => c.id === item.clientId)?.name || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Sector</p>
                      <p className="font-medium text-slate-900">{item.sector || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Partner Firms</p>
                      <p className="font-medium text-slate-900">{item.partnerFirms || '-'}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <div className="text-sm font-medium text-slate-600">
            {page} / {totalPages}
          </div>
          <Button
            variant="outline"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </main>
    </div>
  );
}
