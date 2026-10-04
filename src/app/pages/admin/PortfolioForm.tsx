import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { RichTextEditor } from "../../components/ui/rich-text-editor";
import { Checkbox } from "../../components/ui/checkbox";
import { ImageUpload, MultiImageUpload } from "../../components/ui/imageupload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "../../components/ui/dialog";
import { useContent } from "../../contexts/ContentContext";
import { toast } from "sonner";
import { ArrowLeft, Plus, ChevronUp, ChevronDown, X } from "lucide-react";
import {
  PortfolioItem,
  PortfolioStatus,
  PortfolioType,
  defaultPortfolioFormData,
} from "../../../types/portfolio.types";

type PortfolioFormErrors = Partial<Record<keyof PortfolioItem, string>>;

const createEmptyForm = (): PortfolioItem => ({ ...defaultPortfolioFormData });
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Shared button styles — was previously repeated verbatim on 5 buttons.
const primaryModalBtn =
  "h-10 rounded-md px-5 font-semibold bg-brand-600 cursor-pointer text-white hover:text-white hover:bg-brand-700 transition-colors";

const cancelModalBtn =
  "h-10 rounded-md px-5 font-semibold bg-white cursor-pointer text-brand-600 hover:text-brand-800 hover:bg-white transition-colors";

const backButtonClass = `
  rounded-xl
  px-5
  font-semibold
  shadow-md
  transition-all
  duration-200
  cursor-pointer

  border-2
  border-brand-600
  bg-white
  text-brand-600

  hover:bg-white
  hover:brand-600
  hover:shadow-lg
  hover:text-brand-600
  hover:scale-[1.02]

  active:scale-[0.98]
`;

// Config-driven type-details block keeps project and training fields aligned.
const typeConfig: Record<
  PortfolioType,
  { label: string; typeField: keyof PortfolioItem; typeLabel: string }
> = {
  project: {
    label: "Project Details",
    typeField: "projectType",
    typeLabel: "Project Type",
  },
  consulting: {
    label: "Consulting Details",
    typeField: "serviceType",
    typeLabel: "Service Type",
  },
  training: {
    label: "Training Details",
    typeField: "trainingType",
    typeLabel: "Training Type",
  },
};

const formatType = (type: PortfolioType) => {
  const labels: Record<PortfolioType, string> = {
    project: "Project",
    consulting: "Consulting",
    training: "Training",
  };

  return labels[type];
};

const isValidFiscalYear = (value: string) => {
  const match = value.match(/^(\d{4})\/(\d{2})$/);
  if (!match) return false;

  const startYear = Number(match[1]);
  const endYear = Number(match[2]);
  const expectedEndYear = (startYear + 1) % 100;

  return endYear === expectedEndYear;
};

const isValidImagePath = (value: string) =>
  /^(https?:\/\/|data:image\/|\/|\.\/|\.\.\/).+/.test(value) ||
  /^[\w./-]+\.(?:avif|gif|jpe?g|png|svg|webp)(?:\?.*)?$/.test(value);

const getFieldError = (
  errors: PortfolioFormErrors,
  field: keyof PortfolioItem,
) =>
  errors[field] ? (
    <p className="mt-1 text-sm text-red-600">{errors[field]}</p>
  ) : null;

export function PortfolioForm() {
  const {
    portfolio,
    clients,
    addClient,
    addPortfolioItem,
    updatePortfolioItem,
    sectors,
    addSector,
  } = useContent();

  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const editingSlug = slug || null;
  const isEditing = Boolean(editingSlug);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<PortfolioItem>(createEmptyForm);
  const [errors, setErrors] = useState<PortfolioFormErrors>({});
  const [notFound, setNotFound] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedTypeLabel = formatType(form.type).toLowerCase();

  // Client modal state for adding a new client directly from portfolio form
  const [clientModalOpen, setClientModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientLogo, setNewClientLogo] = useState("");
  const [newClientWebsite, setNewClientWebsite] = useState("");
  const [customFiscalYears, setCustomFiscalYears] = useState<string[]>([]);
  const [newSectorName, setNewSectorName] = useState("");
  const [sectorModalOpen, setSectorModalOpen] = useState(false);

  // Load the item being edited once portfolio data is available.
  useEffect(() => {
    if (!editingSlug) {
      setForm(createEmptyForm());
      setEditingId(null);
      return;
    }

    const existing = portfolio.find((item) => item.slug === editingSlug);
    if (existing) {
      setForm({ ...createEmptyForm(), ...existing });
      setEditingId(existing.id);
      setNotFound(false);
    } else if (portfolio.length > 0) {
      // Portfolio has loaded and the slug genuinely doesn't exist.
      setEditingId(null);
      setNotFound(true);
    }
  }, [editingSlug, portfolio]);

  const goBackToList = () => navigate("/admin/portfolio");

  const handleAddClientFromModal = async () => {
    const name = newClientName.trim();
    if (!name) return toast.error("Client name is required");

    try {
      const newId = await addClient({
        name,
        logoUrl: newClientLogo.trim(),
        website: newClientWebsite.trim(),
      });
      updateForm("clientId", newId);
      setClientModalOpen(false);
      setNewClientName("");
      setNewClientLogo("");
      setNewClientWebsite("");
      toast.success(`Client "${name}" added successfully.`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add client");
    }
  };

  const fiscalYearOptions = useMemo(() => {
    const years = new Set<string>();

    for (let year = 2070; year <= 2085; year++) {
      years.add(`${year}/${String((year + 1) % 100).padStart(2, "0")}`);
    }

    portfolio.forEach((item) => {
      if (item.fiscalYear?.trim()) {
        years.add(item.fiscalYear.trim());
      }
    });

    customFiscalYears.forEach((year) => years.add(year));

    return Array.from(years).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true }),
    );
  }, [portfolio, customFiscalYears]);

  const sectorOptions = useMemo(() => {
    const options = sectors.map((s) => s.name.trim()).filter(Boolean);

    const currentValue = form.sector?.trim();
    if (
      currentValue &&
      !options.some(
        (option) => option.toLowerCase() === currentValue.toLowerCase(),
      )
    ) {
      options.push(currentValue);
    }

    return Array.from(new Set(options)).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true }),
    );
  }, [sectors, form.sector]);

  const findSectorByName = (name: string) =>
    sectors.find(
      (s) => s.name.trim().toLowerCase() === name.trim().toLowerCase(),
    );

  const ensureSectorRecord = async (name?: string) => {
    const sectorName = name?.trim();
    if (!sectorName) return;

    if (findSectorByName(sectorName)) return;

    await addSector({ name: sectorName });
  };

  const handleAddSector = async () => {
    const name = newSectorName.trim();
    if (!name) return toast.error("Sector name is required");

    try {
      await addSector({ name });
      updateForm("sector", name);
      setNewSectorName("");
      setSectorModalOpen(false);
      toast.success(`Sector "${name}" added successfully.`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to add sector");
    }
  };

  const updateForm = <K extends keyof PortfolioItem>(
    key: K,
    value: PortfolioItem[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;

      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const galleryImages = form.galleryImages || [];

  const addGalleryImages = (urls: string[]) => {
    if (urls.length === 0) return;
    updateForm("galleryImages", [...galleryImages, ...urls]);
  };

  const removeGalleryImage = (index: number) => {
    updateForm(
      "galleryImages",
      galleryImages.filter((_, i) => i !== index),
    );
  };

  const moveGalleryImage = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= galleryImages.length) return;

    const next = [...galleryImages];
    [next[index], next[target]] = [next[target], next[index]];
    updateForm("galleryImages", next);
  };

  const handleAddFiscalYear = () => {
    const latestYear = fiscalYearOptions
      .map((fy) => Number(fy.split("/")[0]))
      .sort((a, b) => b - a)[0];

    const nextYear = latestYear + 1;
    const nextFiscalYear = `${nextYear}/${String((nextYear + 1) % 100).padStart(
      2,
      "0",
    )}`;

    setCustomFiscalYears((prev) => [...prev, nextFiscalYear]);
    updateForm("fiscalYear", nextFiscalYear);

    toast.success(`Fiscal year ${nextFiscalYear} added successfully.`);
  };

  const generateSlug = (title: string, existingId?: string) => {
    const baseSlug = title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    if (!baseSlug) return "";

    const slugExists = (slug: string) =>
      portfolio.some((item) => item.slug === slug && item.id !== existingId);

    let slug = baseSlug;
    let counter = 1;

    while (slugExists(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  };

  const handleTitleChange = (title: string) => {
    setForm((current) => ({
      ...current,
      title,
      slug: generateSlug(title, editingId || undefined),
    }));
    setErrors((current) => {
      if (!current.title && !current.slug) return current;

      const next = { ...current };
      delete next.title;
      delete next.slug;
      return next;
    });
  };

  const getPayload = () => {
    const { id: _omitId, status, ...payload } = form;
    const now = new Date().toISOString();
    const slug =
      form.slug.trim() ||
      generateSlug(form.title, editingId || undefined) ||
      `portfolio-item-${Date.now()}`;

    return {
      ...payload,
      ...(status ? { status } : {}),
      title: form.title.trim(),
      slug,
      shortDescription: form.shortDescription.trim(),
      overview: form.overview?.trim(),
      featuredImage: form.featuredImage.trim(),
      galleryImages: (form.galleryImages || []).filter(Boolean),
      sector: form.sector?.trim(),
      clientId: form.clientId?.trim(),
      partnerFirms: form.partnerFirms?.trim(),
      fiscalYear: form.fiscalYear?.trim(),
      location: form.location?.trim(),
      projectType: form.projectType?.trim(),
      contractAmount: form.contractAmount?.trim(),
      serviceType: form.serviceType?.trim(),
      trainingType: form.trainingType?.trim(),
      displayOnHome: Boolean(form.displayOnHome),
      updatedAt: now,
      createdAt: form.createdAt || now,
    };
  };

  const validateForm = () => {
    const nextErrors: PortfolioFormErrors = {};
    const title = form.title.trim();
    const slug = form.slug.trim();
    const fiscalYear = form.fiscalYear?.trim();
    const featuredImage = form.featuredImage.trim();

    if (!title) nextErrors.title = "Title is required";
    if (!fiscalYear) nextErrors.fiscalYear = "Fiscal year is required";
    if (!form.sector?.trim()) nextErrors.sector = "Sector is required";
    if (slug && !slugPattern.test(slug)) {
      nextErrors.slug = "Use lowercase letters, numbers, and hyphens only";
    }
    if (
      slug &&
      portfolio.some((item) => item.slug === slug && item.id !== editingId)
    ) {
      nextErrors.slug = "This slug is already used by another portfolio item";
    }
    if (featuredImage && !isValidImagePath(featuredImage)) {
      nextErrors.featuredImage = "Enter a valid image URL or relative path";
    }
    if (fiscalYear && !isValidFiscalYear(fiscalYear)) {
      nextErrors.fiscalYear = "Use YYYY/YY with the next year, e.g. 2080/81";
    }
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      nextErrors.endDate = "End date cannot be before start date";
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await ensureSectorRecord(form.sector?.trim());
      const payload = getPayload();

      if (isEditing) {
        if (!editingId) {
          toast.error("Portfolio item could not be found");
          return;
        }

        await updatePortfolioItem(editingId, payload);
        toast.success("Portfolio item updated successfully.");
      } else {
        await addPortfolioItem(payload);
        toast.success("Portfolio item added successfully.");
      }

      goBackToList();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while saving");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditing && notFound) {
    return (
      <Card>
        <CardContent className="space-y-4 p-8 text-center">
          <p className="text-gray-600">
            This portfolio item could not be found. It may have been deleted.
          </p>
          <Button
            type="button"
            onClick={goBackToList}
            variant="outline"
            className={backButtonClass}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portfolio List
          </Button>
        </CardContent>
      </Card>
    );
  }

  const activeTypeConfig = typeConfig[form.type];

  return (
    <div className="space-y-6">
      <Button
        type="button"
        onClick={goBackToList}
        variant="outline"
        className={backButtonClass}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Portfolio List
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Update Portfolio Item" : "Add Portfolio Item"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Basic Info
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <Label>Type</Label>
                  <Select
                    value={form.type}
                    onValueChange={(value) =>
                      updateForm("type", value as PortfolioType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) =>
                      updateForm("status", value as PortfolioStatus)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Fiscal Year *</Label>

                  <div className="flex gap-2">
                    <Select
                      value={form.fiscalYear || ""}
                      onValueChange={(value) => updateForm("fiscalYear", value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select Fiscal Year" />
                      </SelectTrigger>

                      <SelectContent>
                        {fiscalYearOptions.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      type="button"
                      variant="outline"
                      className={primaryModalBtn}
                      onClick={handleAddFiscalYear}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>

                  {getFieldError(errors, "fiscalYear")}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={form.title}
                    onChange={(event) => handleTitleChange(event.target.value)}
                    required
                    aria-invalid={Boolean(errors.title)}
                  />
                  {getFieldError(errors, "title")}
                </div>

                <div>
                  <Label>Slug</Label>
                  <Input
                    value={form.slug}
                    onChange={(event) => updateForm("slug", event.target.value)}
                    placeholder="auto-generated-from-title"
                    aria-invalid={Boolean(errors.slug)}
                  />
                  {getFieldError(errors, "slug")}
                </div>
              </div>
            </div>

            {/* Type-specific details share one render path for project and training items. */}
            <div className="border-t pt-6">
              <div className="space-y-3 rounded-lg border p-4">
                <h3 className="font-semibold">{activeTypeConfig.label}</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Input
                    placeholder={activeTypeConfig.typeLabel}
                    value={(form[activeTypeConfig.typeField] as string) || ""}
                    onChange={(event) =>
                      updateForm(activeTypeConfig.typeField, event.target.value as any)
                    }
                    aria-invalid={Boolean(errors[activeTypeConfig.typeField])}
                  />
                  <Input
                    type="number"
                    inputMode="decimal"
                    placeholder="Contract Amount (NRs.)"
                    value={form.contractAmount || ""}
                    onChange={(event) =>
                      updateForm("contractAmount", event.target.value)
                    }
                    aria-invalid={Boolean(errors.contractAmount)}
                  />
                  {form.type === "training" && (
                    <Select
                      value={form.mode || "physical"}
                      onValueChange={(value) =>
                        updateForm(
                          "mode",
                          value as "online" | "physical" | "hybrid",
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online</SelectItem>
                        <SelectItem value="physical">Physical</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
                {getFieldError(errors, activeTypeConfig.typeField)}
                {getFieldError(errors, "contractAmount")}
                {form.type === "training" && getFieldError(errors, "mode")}
              </div>
            </div>

            <div className="space-y-3 border-t pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Visibility
              </h3>

              <label className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                <Checkbox
                  className="mt-0.5"
                  checked={Boolean(form.displayOnHome)}
                  onCheckedChange={(checked) =>
                    updateForm("displayOnHome", checked === true)
                  }
                />
                <span>
                  <span className="font-medium">Display on Home Screen</span>
                  <p className="text-gray-500">
                    Marking this item will make it eligible for the home
                    screen featured section (up to 4 items per type).
                  </p>
                </span>
              </label>

            </div>

            <div className="space-y-4 border-t pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Description
              </h3>
              <div>
                <div className="flex items-center justify-between">
                  <Label>Short Description</Label>
                  <span className="text-xs text-gray-400">
                    Brief summary shown on cards and previews
                  </span>
                </div>
                <Input
                  value={form.shortDescription}
                  onChange={(event) =>
                    updateForm("shortDescription", event.target.value)
                  }
                  placeholder="One or two sentences shown on cards and previews"
                  aria-invalid={Boolean(errors.shortDescription)}
                />
                {getFieldError(errors, "shortDescription")}
              </div>

              <div>
                <Label>Overview</Label>
                <RichTextEditor
                  value={form.overview || ""}
                  onChange={(html) => updateForm("overview", html)}
                  placeholder="Full narrative shown on the detail page (background, scope, outcome)"
                  minHeight="200px"
                />
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Client &amp; Sector
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Client</Label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={form.clientId || undefined}
                      onValueChange={(value) =>
                        updateForm(
                          "clientId",
                          value === "none" ? undefined : value,
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {clients.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Dialog
                      open={clientModalOpen}
                      onOpenChange={setClientModalOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className={primaryModalBtn}>
                          <Plus className="h-4 w-4 mr-2" /> Add Client
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Client</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-3">
                          <div>
                            <Label>Name *</Label>
                            <Input
                              value={newClientName}
                              onChange={(e) => setNewClientName(e.target.value)}
                            />
                          </div>

                          <div>
                            <Label>Logo URL</Label>
                            <Input
                              value={newClientLogo}
                              onChange={(e) => setNewClientLogo(e.target.value)}
                              placeholder="https://..."
                            />
                          </div>

                          <div>
                            <Label>Website</Label>
                            <Input
                              value={newClientWebsite}
                              onChange={(e) =>
                                setNewClientWebsite(e.target.value)
                              }
                              placeholder="https://..."
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button
                            type="button"
                            onClick={handleAddClientFromModal}
                            className={primaryModalBtn}
                          >
                            Add Client
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setClientModalOpen(false)}
                            className={cancelModalBtn}
                          >
                            Cancel
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div>
                  <Label>Partner Firms</Label>
                  <Input
                    value={form.partnerFirms || ""}
                    onChange={(event) =>
                      updateForm("partnerFirms", event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Sector *</Label>
                  <div className="flex gap-2">
                    <Select
                      value={form.sector || ""}
                      onValueChange={(value) => updateForm("sector", value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>

                      <SelectContent>
                        {sectorOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Dialog
                      open={sectorModalOpen}
                      onOpenChange={setSectorModalOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className={primaryModalBtn}>
                          <Plus className="h-4 w-4 mr-2" /> Add Sector
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Sector</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div>
                            <Label>Name *</Label>
                            <Input
                              value={newSectorName}
                              onChange={(e) => setNewSectorName(e.target.value)}
                              placeholder="Sector name"
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button type="button" onClick={handleAddSector} className={primaryModalBtn}>
                            <Plus className="h-4 w-4 mr-1" /> Add Sector
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSectorModalOpen(false)}
                            className={cancelModalBtn}
                          >
                            Cancel
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {getFieldError(errors, "sector")}
                </div>

                <div>
                  <Label>Location</Label>
                  <Input
                    value={form.location || ""}
                    onChange={(event) =>
                      updateForm("location", event.target.value)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Schedule
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={form.startDate || ""}
                    onChange={(event) =>
                      updateForm("startDate", event.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    value={form.endDate || ""}
                    onChange={(event) =>
                      updateForm("endDate", event.target.value)
                    }
                    aria-invalid={Boolean(errors.endDate)}
                  />
                  {getFieldError(errors, "endDate")}
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Media
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <ImageUpload
                    label="Featured Image"
                    folder="portfolio"
                    value={form.featuredImage}
                    onChange={(url) => updateForm("featuredImage", url)}
                  />

                  {getFieldError(errors, "featuredImage")}
                </div>
              </div>

              {form.featuredImage && (
                <img
                  src={form.featuredImage}
                  alt={form.title || "Portfolio preview"}
                  className="h-44 w-full rounded-lg border object-cover"
                />
              )}
            </div>

            <div className="space-y-4 border-t pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Item Gallery
              </h3>
              <p className="text-sm text-gray-500">
                Photos for this item&apos;s public gallery — select multiple
                files at once. The detail page shows the first four with a
                &quot;View Full Gallery&quot; link.
              </p>

              {galleryImages.length > 0 && (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {galleryImages.map((url, index) => (
                    <div
                      key={`${url}-${index}`}
                      className="group relative overflow-hidden rounded-lg border"
                    >
                      <img
                        src={url}
                        alt={`Gallery image ${index + 1}`}
                        className="h-28 w-full object-cover"
                      />

                      <div className="absolute inset-0 flex items-center justify-center gap-1 bg-slate-950/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(index, -1)}
                          disabled={index === 0}
                          title="Move earlier"
                          className="rounded bg-white/90 p-1 text-slate-800 disabled:opacity-40"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveGalleryImage(index, 1)}
                          disabled={index === galleryImages.length - 1}
                          title="Move later"
                          className="rounded bg-white/90 p-1 text-slate-800 disabled:opacity-40"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          title="Remove"
                          className="rounded bg-red-600 p-1 text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="max-w-md">
                <MultiImageUpload
                  label="Upload Gallery Images"
                  folder={`portfolio-galleries/${form.slug || "unsorted"}`}
                  onChange={addGalleryImages}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={goBackToList}
                disabled={isSubmitting}
                className="h-11 px-6 rounded-lg cursor-pointer border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 px-8 rounded-lg bg-brand-700 text-white hover:bg-brand-800 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditing
                    ? "Update Portfolio Item"
                    : "Add Portfolio Item"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
