export type PortfolioType =
  | 'project'
  | 'consulting'
  | 'training';

export type PortfolioStatus =
  | 'upcoming'
  | 'ongoing'
  | 'completed';

export type PortfolioFilterType = PortfolioType | 'all';
export type PortfolioSortKey =
  | 'title'
  | 'fiscalYear'
  | 'client'
  | 'contractAmount'
  | 'createdAt';
export type PortfolioSortOrder = 'asc' | 'desc';

export interface PortfolioFiltersState {
  type?: PortfolioFilterType;
  sector?: string;
  client?: string;
  fiscalYear?: string;
  search?: string;
}

/** @deprecated Use PortfolioFiltersState instead */
export type PortfolioFilters = PortfolioFiltersState;

export interface PortfolioItem {
  id: string;
  type: PortfolioType;
  title: string;
  slug: string;
  shortDescription: string;
  overview?: string;
  fullDescription?: string;
  featuredImage: string;
  galleryImages?: string[];
  sector?: string;
  clientId?: string;
  partnerFirms?: string;
  fiscalYear?: string;
  status?: PortfolioStatus;
  location?: string;
  startDate?: string;
  endDate?: string;
  projectType?: string;
  contractAmount?: string;
  serviceType?: string;
  trainingType?: string;
  mode?: 'online' | 'physical' | 'hybrid';
  displayOnHome?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const defaultPortfolioFormData: PortfolioItem = {
  id: '',
  type: 'project',
  title: '',
  slug: '',
  shortDescription: '',
  overview: '',
  featuredImage: '',
  galleryImages: [],
  sector: '',
  clientId: '',
  fiscalYear: '',
  location: '',
  startDate: '',
  endDate: '',
  projectType: '',
  contractAmount: '',
  serviceType: '',
  trainingType: '',
  mode: 'physical',
  displayOnHome: false,
};
