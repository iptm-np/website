export type Section =
  | 'dashboard'
  | 'portfolio'
  | 'team'
  | 'clients'
  | 'sectors'
  | 'faqs'
  | 'hero-carousel'
  | 'page-heroes'
  | 'contact-info'
  | 'privacy-policy';


export type TeamForm = {
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
  slug: string;
  isLeadership?: boolean;
};

export const defaultTeamForm: TeamForm = {
  name: '',
  position: '',
  bio: '',
  imageUrl: '',
  slug: '',
  isLeadership: false,
};

export type PortfolioForm = {
  title: string;
  description: string;
  category: string;
  projectType: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  status: string;
  slug: string;
  client: string;
  location: string;
  area: string;
  completionDate: string;
  servicesProvided: string[];
  overview: string;
  galleryImages: string[];
  result: string;
  keyFeatures: string[];
  clientTestimonial: string;
  clientName: string;
  faqs: string[];
};

export const defaultPortfolioForm: PortfolioForm = {
  title: '',
  description: '',
  category: '',
  projectType: 'Design and Build',
  imageUrl: '',
  startDate: '',
  endDate: '',
  status: 'ongoing',
  slug: '',
  client: '',
  location: '',
  area: '',
  completionDate: '',
  servicesProvided: [],
  overview: '',
  galleryImages: [],
  result: '',
  keyFeatures: [],
  clientTestimonial: '',
  clientName: '',
  faqs: [],
};



