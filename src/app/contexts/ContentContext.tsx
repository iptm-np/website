import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../../firebase"; // Adjust path if needed
import { PortfolioItem } from "../../types/portfolio.types";
import { getUniqueSlug, slugPattern, slugify } from "../../utils/slug";

/* =========================
   Interfaces
========================= */

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  imageUrl: string;
  slug: string;
  isLeadership?: boolean;
}

export interface Client {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  slug?: string;
}

export interface Sector {
  id: string;
  name: string;
  slug?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  projectType: "Design and Build" | "Contract";
  imageUrl: string;
  startDate: string;
  endDate: string;
  status: "ongoing" | "completed";
  slug: string;
  client?: string;
  clientId?: string;
  location?: string;
  area?: string;
  completionDate?: string;
  servicesProvided?: string[];
  overview?: string;
  galleryImages?: string[];
  result?: string;
  keyFeatures?: string[];
  beforeImage?: string;
  afterImage?: string;
  clientTestimonial?: string;
  clientName?: string;
  faqs?: { question: string; answer: string }[];
}

export interface GalleryImage {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export interface Event {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  duration: string;
  type: "Workshop" | "Training" | "Seminar";
  description: string;
  topics: string[];
  slug: string;
}

export interface HeroCarouselImage {
  id: string;
  url: string;
  order: number;
}

export interface PageHeroImages {
  about?: string;
  companyProfile?: string;
  portfolio?: string;
  consulting?: string;
  training?: string;
  projects?: string;
  contact?: string;
  team?: string;
  companySector?: string;
  gallery?: string;
}

export interface HomeFaq {
  id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PrivacyPolicy {
  content: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface ContactInfo {
  address: string;
  email: string;
  phone: string;
  businessHours?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  x?: string;
}

interface ContentContextType {
  teamMembers: TeamMember[];
  projects: Project[];
  galleryImages: GalleryImage[];
  events: Event[];
  clients: Client[];
  sectors: Sector[];
  portfolio: PortfolioItem[];
  homeFaqs: HomeFaq[];
  privacyPolicy: PrivacyPolicy | null;
  heroImages: HeroCarouselImage[];
  contactInfo: ContactInfo | null;
  pageHeroImages: PageHeroImages;

  addTeamMember: (member: Omit<TeamMember, "id">) => Promise<void>;
  updateTeamMember: (
    id: string,
    member: Omit<TeamMember, "id">
  ) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;

  addProject: (project: Omit<Project, "id">) => Promise<void>;
  updateProject: (
    id: string,
    project: Omit<Project, "id">
  ) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  addGalleryImage: (
    image: Omit<GalleryImage, "id">
  ) => Promise<void>;
  updateGalleryImage: (
    id: string,
    image: Omit<GalleryImage, "id">
  ) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;

  addEvent: (event: Omit<Event, "id">) => Promise<void>;
  updateEvent: (
    id: string,
    event: Omit<Event, "id">
  ) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  addClient: (client: Omit<Client, "id">) => Promise<string>;
  updateClient: (
    id: string,
    client: Omit<Client, "id">
  ) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  addSector: (sector: Omit<Sector, "id">) => Promise<string>;
  updateSector: (id: string, sector: Omit<Sector, "id">) => Promise<void>;
  deleteSector: (id: string) => Promise<void>;

  addPortfolioItem: (item: Omit<PortfolioItem, "id">) => Promise<void>;
  updatePortfolioItem: (
    id: string,
    item: Omit<PortfolioItem, "id">
  ) => Promise<void>;
  deletePortfolioItem: (id: string) => Promise<void>;

  addHomeFaq: (faq: Omit<HomeFaq, "id">) => Promise<void>;
  updateHomeFaq: (id: string, faq: Omit<HomeFaq, "id">) => Promise<void>;
  deleteHomeFaq: (id: string) => Promise<void>;

  savePrivacyPolicy: (policy: PrivacyPolicy) => Promise<void>;

  addHeroImage: (image: Omit<HeroCarouselImage, "id">) => Promise<void>;
  deleteHeroImage: (id: string) => Promise<void>;
  updateHeroImages: (images: HeroCarouselImage[]) => Promise<void>;

  updatePageHeroImages: (images: PageHeroImages) => Promise<void>;

  saveContactInfo: (info: ContactInfo) => Promise<void>;
}

/* =========================
   Context
========================= */

const ContentContext = createContext<ContentContextType | undefined>(
  undefined
);

/* =========================
   Provider
========================= */

export function ContentProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [homeFaqs, setHomeFaqs] = useState<HomeFaq[]>([]);
  const [privacyPolicy, setPrivacyPolicy] = useState<PrivacyPolicy | null>(null);
  const [heroImages, setHeroImages] = useState<HeroCarouselImage[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [pageHeroImages, setPageHeroImages] = useState<PageHeroImages>({});

  /* =========================
     Fetch Data
  ========================= */

  useEffect(() => {
    fetchTeamMembers();
    fetchProjects();
    fetchGalleryImages();
    fetchEvents();
    fetchClients();
    fetchSectors();
    fetchPortfolio();
    fetchHomeFaqs();
    fetchPrivacyPolicy();
    fetchHeroImages();
    fetchContactInfo();
    fetchPageHeroImages();
  }, []);

  /* =========================
     TEAM MEMBERS
  ========================= */

  const fetchTeamMembers = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "teamMembers")
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<TeamMember, "id">),
      }));

      setTeamMembers(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  const addTeamMember = async (
    member: Omit<TeamMember, "id">
  ) => {
    try {
      const docRef = await addDoc(
        collection(db, "teamMembers"),
        member
      );

      setTeamMembers((prev) => [
        ...prev,
        {
          ...member,
          id: docRef.id,
        },
      ]);
    } catch (error) {
      console.error("Error adding team member:", error);
    }
  };

  const updateTeamMember = async (
    id: string,
    member: Omit<TeamMember, "id">
  ) => {
    try {
      await updateDoc(doc(db, "teamMembers", id), {
        ...member,
      });

      setTeamMembers((prev) =>
        prev.map((m) =>
          m.id === id ? { ...member, id } : m
        )
      );
    } catch (error) {
      console.error("Error updating team member:", error);
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      await deleteDoc(doc(db, "teamMembers", id));

      setTeamMembers((prev) =>
        prev.filter((member) => member.id !== id)
      );
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  /* =========================
     PROJECTS
  ========================= */

  const fetchProjects = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "projects")
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Project, "id">),
      }));

      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const addProject = async (
    project: Omit<Project, "id">
  ) => {
    try {
      const docRef = await addDoc(
        collection(db, "projects"),
        project
      );

      setProjects((prev) => [
        ...prev,
        {
          ...project,
          id: docRef.id,
        },
      ]);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const updateProject = async (
    id: string,
    project: Omit<Project, "id">
  ) => {
    try {
      await updateDoc(doc(db, "projects", id), {
        ...project,
      });

      setProjects((prev) =>
        prev.map((p) =>
          p.id === id ? { ...project, id } : p
        )
      );
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await deleteDoc(doc(db, "projects", id));

      setProjects((prev) =>
        prev.filter((project) => project.id !== id)
      );
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  /* =========================
     GALLERY IMAGES
  ========================= */

  const fetchGalleryImages = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "galleryImages")
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<GalleryImage, "id">),
      }));

      setGalleryImages(data);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    }
  };

  const addGalleryImage = async (
    image: Omit<GalleryImage, "id">
  ) => {
    try {
      const docRef = await addDoc(
        collection(db, "galleryImages"),
        image
      );

      setGalleryImages((prev) => [
        ...prev,
        {
          ...image,
          id: docRef.id,
        },
      ]);
    } catch (error) {
      console.error("Error adding gallery image:", error);
    }
  };

  const updateGalleryImage = async (
    id: string,
    image: Omit<GalleryImage, "id">
  ) => {
    try {
      await updateDoc(doc(db, "galleryImages", id), {
        ...image,
      });

      setGalleryImages((prev) =>
        prev.map((i) =>
          i.id === id ? { ...image, id } : i
        )
      );
    } catch (error) {
      console.error("Error updating gallery image:", error);
    }
  };

  const deleteGalleryImage = async (id: string) => {
    try {
      await deleteDoc(doc(db, "galleryImages", id));

      setGalleryImages((prev) =>
        prev.filter((image) => image.id !== id)
      );
    } catch (error) {
      console.error("Error deleting gallery image:", error);
    }
  };

  /* =========================
     EVENTS
  ========================= */

  const fetchEvents = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "events")
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Event, "id">),
      }));

      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const addEvent = async (
    event: Omit<Event, "id">
  ) => {
    try {
      const docRef = await addDoc(
        collection(db, "events"),
        event
      );

      setEvents((prev) => [
        ...prev,
        {
          ...event,
          id: docRef.id,
        },
      ]);
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const updateEvent = async (
    id: string,
    event: Omit<Event, "id">
  ) => {
    try {
      await updateDoc(doc(db, "events", id), {
        ...event,
      });

      setEvents((prev) =>
        prev.map((e) =>
          e.id === id ? { ...event, id } : e
        )
      );
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteDoc(doc(db, "events", id));

      setEvents((prev) =>
        prev.filter((event) => event.id !== id)
      );
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  /* =========================
     CLIENTS
  ========================= */

  const fetchClients = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "clients")
      );

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Client, "id">),
      }));

      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const addClient = async (
    client: Omit<Client, "id">
  ): Promise<string> => {
    try {
      const slug = client.slug?.trim() || getUniqueSlug(
        client.name,
        clients.map((c) => c.slug || slugify(c.name))
      );

      if (!slug || !slugPattern.test(slug)) {
        throw new Error('Client slug must use lowercase letters, numbers, and hyphens only');
      }

      // enforce unique client names (case-insensitive)
      const exists = clients.some(
        (c) => c.name.trim().toLowerCase() === client.name.trim().toLowerCase()
      );

      if (exists) {
        throw new Error('Client with this name already exists');
      }

      const slugExists = clients.some(
        (c) => (c.slug || slugify(c.name)).trim().toLowerCase() === slug.toLowerCase()
      );

      if (slugExists) {
        throw new Error('Client with this slug already exists');
      }

      const payload = { ...client, slug };
      const docRef = await addDoc(collection(db, "clients"), payload);

      setClients((prev) => [
        ...prev,
        {
          ...payload,
          id: docRef.id,
        },
      ]);
      return docRef.id;
    } catch (error) {
      console.error("Error adding client:", error);
      throw error;
    }
  };

  const updateClient = async (
    id: string,
    client: Omit<Client, "id">
  ) => {
    try {
      const slug = client.slug?.trim() || getUniqueSlug(
        client.name,
        clients.map((c) => c.slug || slugify(c.name)),
        clients.find((c) => c.id === id)?.slug || slugify(clients.find((c) => c.id === id)?.name || '')
      );

      if (!slug || !slugPattern.test(slug)) {
        throw new Error('Client slug must use lowercase letters, numbers, and hyphens only');
      }

      // enforce unique client names (case-insensitive), excluding current
      const exists = clients.some(
        (c) => c.id !== id && c.name.trim().toLowerCase() === client.name.trim().toLowerCase()
      );

      if (exists) {
        throw new Error('Another client with this name already exists');
      }

      const slugExists = clients.some(
        (c) =>
          c.id !== id &&
          (c.slug || slugify(c.name)).trim().toLowerCase() === slug.toLowerCase()
      );

      if (slugExists) {
        throw new Error('Another client with this slug already exists');
      }

      const payload = { ...client, slug };

      await updateDoc(doc(db, "clients", id), {
        ...payload,
      });

      setClients((prev) =>
        prev.map((c) => (c.id === id ? { ...payload, id } : c))
      );
    } catch (error) {
      console.error("Error updating client:", error);
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      // prevent deletion if any portfolio item references this client
      const referenced = portfolio.some((p) => p.clientId === id);

      if (referenced) {
        throw new Error('Cannot delete client: referenced by portfolio items');
      }

      await deleteDoc(doc(db, "clients", id));

      setClients((prev) => prev.filter((client) => client.id !== id));
    } catch (error) {
      console.error("Error deleting client:", error);
      throw error;
    }
  };

  /* =========================
     SECTORS
  ========================= */

  const fetchSectors = async () => {
    try {
      const snapshot = await getDocs(collection(db, "sectors"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Sector, "id">),
      }));

      setSectors(data);
    } catch (error) {
      console.error("Error fetching sectors:", error);
    }
  };

  const addSector = async (sector: Omit<Sector, "id">): Promise<string> => {
    try {
      const slug = sector.slug?.trim() || getUniqueSlug(
        sector.name,
        sectors.map((s) => s.slug || slugify(s.name))
      );

      if (!slug || !slugPattern.test(slug)) {
        throw new Error('Sector slug must use lowercase letters, numbers, and hyphens only');
      }

      const exists = sectors.some(
        (s) => s.name.trim().toLowerCase() === sector.name.trim().toLowerCase()
      );

      if (exists) {
        throw new Error('Sector with this name already exists');
      }

      const slugExists = sectors.some(
        (s) => (s.slug || slugify(s.name)).trim().toLowerCase() === slug.toLowerCase()
      );

      if (slugExists) {
        throw new Error('Sector with this slug already exists');
      }

      const payload = { ...sector, slug };
      const docRef = await addDoc(collection(db, "sectors"), payload);

      setSectors((prev) => [
        ...prev,
        {
          ...payload,
          id: docRef.id,
        },
      ]);

      return docRef.id;
    } catch (error) {
      console.error("Error adding sector:", error);
      throw error;
    }
  };

  const updateSector = async (id: string, sector: Omit<Sector, "id">) => {
    try {
      const slug = sector.slug?.trim() || getUniqueSlug(
        sector.name,
        sectors.map((s) => s.slug || slugify(s.name)),
        sectors.find((s) => s.id === id)?.slug || slugify(sectors.find((s) => s.id === id)?.name || '')
      );

      if (!slug || !slugPattern.test(slug)) {
        throw new Error('Sector slug must use lowercase letters, numbers, and hyphens only');
      }

      const exists = sectors.some(
        (s) => s.id !== id && s.name.trim().toLowerCase() === sector.name.trim().toLowerCase()
      );

      if (exists) {
        throw new Error('Another sector with this name already exists');
      }

      const slugExists = sectors.some(
        (s) =>
          s.id !== id &&
          (s.slug || slugify(s.name)).trim().toLowerCase() === slug.toLowerCase()
      );

      if (slugExists) {
        throw new Error('Another sector with this slug already exists');
      }

      const payload = { ...sector, slug };

      await updateDoc(doc(db, "sectors", id), { ...payload });

      setSectors((prev) => prev.map((s) => (s.id === id ? { ...payload, id } : s)));
    } catch (error) {
      console.error("Error updating sector:", error);
      throw error;
    }
  };

  const deleteSector = async (id: string) => {
    try {
      const referenced = portfolio.some((p) => p.sector?.trim() && p.sector === sectors.find(s => s.id === id)?.name);

      if (referenced) {
        throw new Error('Cannot delete sector: referenced by portfolio items');
      }

      await deleteDoc(doc(db, "sectors", id));

      setSectors((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting sector:", error);
      throw error;
    }
  };

  /* =========================
     PORTFOLIO
  ========================= */

  const fetchPortfolio = async () => {
    try {
      const snapshot = await getDocs(collection(db, "portfolio"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<PortfolioItem, "id">),
      }));

      setPortfolio(data);
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    }
  };

  const addPortfolioItem = async (item: Omit<PortfolioItem, "id">) => {
    try {
      // remove undefined fields so Firestore doesn't receive `undefined`
      const payload = Object.fromEntries(
        Object.entries(item).filter(([, v]) => v !== undefined)
      );

      const docRef = await addDoc(collection(db, "portfolio"), payload as any);

      setPortfolio((prev) => [
        ...prev,
        {
          ...item,
          id: docRef.id,
        },
      ]);
    } catch (error) {
      console.error("Error adding portfolio item:", error);
      throw error;
    }
  };

  const updatePortfolioItem = async (
    id: string,
    item: Omit<PortfolioItem, "id">
  ) => {
    try {
      const payload = Object.fromEntries(
        Object.entries(item).filter(([, v]) => v !== undefined)
      );

      await updateDoc(doc(db, "portfolio", id), payload as any);

      setPortfolio((prev) =>
        prev.map((portfolioItem) =>
          portfolioItem.id === id ? { ...item, id } : portfolioItem
        )
      );
    } catch (error) {
      console.error("Error updating portfolio item:", error);
      throw error;
    }
  };

  const deletePortfolioItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "portfolio", id));

      setPortfolio((prev) =>
        prev.filter((portfolioItem) => portfolioItem.id !== id)
      );
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      throw error;
    }
  };  /* =========================
     HERO CAROUSEL IMAGES
     ========================= */

  const fetchHeroImages = async () => {
    try {
      const snapshot = await getDoc(doc(db, "siteContent", "heroCarousel"));

      if (!snapshot.exists()) {
        setHeroImages([]);
        return;
      }

      const data = snapshot.data() as { images: HeroCarouselImage[] };
      setHeroImages((data.images || []).sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("Error fetching hero carousel images:", error);
    }
  };

  const saveHeroImages = async (images: HeroCarouselImage[]) => {
    try {
      const payload = { images };
      await setDoc(doc(db, "siteContent", "heroCarousel"), payload);
      setHeroImages(images.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error("Error saving hero carousel images:", error);
      throw error;
    }
  };

  const addHeroImage = async (image: Omit<HeroCarouselImage, "id">) => {
    try {
      const id = `hero_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const newImage = { ...image, id };
      const updated = [...heroImages, newImage]
        .sort((a, b) => a.order - b.order);
      await saveHeroImages(updated);
    } catch (error) {
      console.error("Error adding hero image:", error);
      throw error;
    }
  };

  const deleteHeroImage = async (id: string) => {
    try {
      const updated = heroImages
        .filter((img) => img.id !== id)
        .map((img, index) => ({ ...img, order: index }));
      await saveHeroImages(updated);
    } catch (error) {
      console.error("Error deleting hero image:", error);
      throw error;
    }
  };

  const updateHeroImages = async (images: HeroCarouselImage[]) => {
    try {
      await saveHeroImages(images);
    } catch (error) {
      console.error("Error updating hero images:", error);
      throw error;
    }
  };

  /* =========================
     PAGE HERO BACKGROUNDS
     ========================= */

  const fetchPageHeroImages = async () => {
    try {
      const snapshot = await getDoc(doc(db, "siteContent", "pageHeroImages"));

      if (!snapshot.exists()) {
        setPageHeroImages({});
        return;
      }

      setPageHeroImages(snapshot.data() as PageHeroImages);
    } catch (error) {
      console.error("Error fetching page hero images:", error);
    }
  };

  const updatePageHeroImages = async (images: PageHeroImages) => {
    try {
      const payload = Object.fromEntries(
        Object.entries(images).filter(([, v]) => v !== undefined && v !== "")
      ) as PageHeroImages;

      await setDoc(doc(db, "siteContent", "pageHeroImages"), payload);
      setPageHeroImages(payload);
    } catch (error) {
      console.error("Error saving page hero images:", error);
      throw error;
    }
  };

  /* =========================
     CONTACT INFO
     ========================= */

  const fetchContactInfo = async () => {
    try {
      const snapshot = await getDoc(doc(db, "siteContent", "contactInfo"));

      if (!snapshot.exists()) {
        setContactInfo(null);
        return;
      }

      setContactInfo(snapshot.data() as ContactInfo);
    } catch (error) {
      console.error("Error fetching contact info:", error);
    }
  };

  const saveContactInfo = async (info: ContactInfo) => {
    try {
      const payload = Object.fromEntries(
        Object.entries(info).filter(([, v]) => v !== undefined)
      ) as ContactInfo;

      await setDoc(doc(db, "siteContent", "contactInfo"), payload);
      setContactInfo(payload);
    } catch (error) {
      console.error("Error saving contact info:", error);
      throw error;
    }
  };

  /* =========================
     HOME FAQS
     ========================= */

  const sortHomeFaqs = (items: HomeFaq[]) =>
    [...items].sort((a, b) =>
      (a.createdAt || '').localeCompare(b.createdAt || '')
    );

  const fetchHomeFaqs = async () => {
    try {
      const snapshot = await getDocs(collection(db, "homeFaqs"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<HomeFaq, "id">),
      }));

      setHomeFaqs(sortHomeFaqs(data));
    } catch (error) {
      console.error("Error fetching home FAQs:", error);
    }
  };

  const addHomeFaq = async (faq: Omit<HomeFaq, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "homeFaqs"), faq);

      setHomeFaqs((prev) =>
        sortHomeFaqs([
          ...prev,
          {
            ...faq,
            id: docRef.id,
          },
        ])
      );
    } catch (error) {
      console.error("Error adding home FAQ:", error);
      throw error;
    }
  };

  const updateHomeFaq = async (id: string, faq: Omit<HomeFaq, "id">) => {
    try {
      await updateDoc(doc(db, "homeFaqs", id), { ...faq });

      setHomeFaqs((prev) =>
        sortHomeFaqs(prev.map((item) => (item.id === id ? { ...faq, id } : item)))
      );
    } catch (error) {
      console.error("Error updating home FAQ:", error);
      throw error;
    }
  };

  const deleteHomeFaq = async (id: string) => {
    try {
      await deleteDoc(doc(db, "homeFaqs", id));

      setHomeFaqs((prev) => prev.filter((faq) => faq.id !== id));
    } catch (error) {
      console.error("Error deleting home FAQ:", error);
      throw error;
    }
  };

  /* =========================
     PRIVACY POLICY
  ========================= */

  const fetchPrivacyPolicy = async () => {
    try {
      const snapshot = await getDoc(doc(db, "siteContent", "privacyPolicy"));

      if (!snapshot.exists()) {
        setPrivacyPolicy(null);
        return;
      }

      setPrivacyPolicy(snapshot.data() as PrivacyPolicy);
    } catch (error) {
      console.error("Error fetching privacy policy:", error);
    }
  };

const savePrivacyPolicy = async (policy: PrivacyPolicy) => {
  try {
    // Strip undefined fields — Firestore rejects them with setDoc
    const payload = Object.fromEntries(
      Object.entries(policy).filter(([, v]) => v !== undefined)
    ) as PrivacyPolicy;
 
    await setDoc(doc(db, "siteContent", "privacyPolicy"), payload);
    setPrivacyPolicy(payload);
  } catch (error) {
    console.error("Error saving privacy policy:", error);
    throw error;
  }
};

  /* =========================
     Provider Return
  ========================= */

  return (
    <ContentContext.Provider
      value={{
        teamMembers,
        projects,
        galleryImages,
        events,
        clients,
        portfolio,
        homeFaqs,
        privacyPolicy,
        heroImages,
        contactInfo,
        pageHeroImages,

        addTeamMember,
        updateTeamMember,
        deleteTeamMember,

        addProject,
        updateProject,
        deleteProject,

        addGalleryImage,
        updateGalleryImage,
        deleteGalleryImage,

        addEvent,
        updateEvent,
        deleteEvent,

        addClient,
        updateClient,
        deleteClient,
        sectors,
        addSector,
        updateSector,
        deleteSector,

        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,

        addHomeFaq,
        updateHomeFaq,
        deleteHomeFaq,

        savePrivacyPolicy,

        addHeroImage,
        deleteHeroImage,
        updateHeroImages,

        updatePageHeroImages,

        saveContactInfo,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

/* =========================
   Custom Hook
========================= */

export function useContent() {
  const context = useContext(ContentContext);

  if (!context) {
    throw new Error(
      "useContent must be used within ContentProvider"
    );
  }

  return context;
}
