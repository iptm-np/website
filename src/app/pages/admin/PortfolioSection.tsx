import { useMemo, useState } from "react";
import { SanitizedHtml } from "../../components/ui/sanitized-html";
import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "../../components/ui/dialog";
import { useContent } from "../../contexts/ContentContext";
import { toast } from "sonner";
import { Edit, Search, Trash2, Plus } from "lucide-react";
import { PortfolioItem, PortfolioType } from "../../../types/portfolio.types";

type TypeFilter = PortfolioType | "all";
type FeaturedFilter = "all" | "featured" | "not-featured";

const formatType = (type: PortfolioType) => {
  const labels: Record<PortfolioType, string> = {
    project: "Project",
    consulting: "Consulting",
    training: "Training",
  };

  return labels[type];
};

export function PortfolioSection() {
  const { portfolio, clients, deletePortfolioItem } = useContent();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await deletePortfolioItem(deleteTargetId);
      toast.success("Portfolio item deleted successfully.");
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
    }
  };

  const openDeleteDialog = (id: string) => {
    setDeleteTargetId(id);
    setDeleteDialogOpen(true);
  };

  const filteredPortfolio = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return portfolio.filter((item: PortfolioItem) => {
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" ? item.displayOnHome : !item.displayOnHome);
      const clientName = clients.find((c) => c.id === item.clientId)?.name;
      const matchesSearch =
        !search ||
        [
          item.title,
          item.shortDescription,
          clientName,
          item.sector,
          item.location,
          item.fiscalYear,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(search));

      return matchesType && matchesFeatured && matchesSearch;
    });
  }, [portfolio, typeFilter, featuredFilter, searchQuery, clients]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle>Portfolio List ({filteredPortfolio.length})</CardTitle>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button
                type="button"
                size="sm"
                onClick={() => navigate("/admin/portfolio/add")}
                className="h-10 rounded-md px-5 font-semibold bg-brand-600 cursor-pointer text-white hover:bg-brand-700 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Portfolio Item
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(300px,1fr)_220px_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-10 h-10"
                placeholder="Search..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </div>

            <Select
              value={typeFilter}
              onValueChange={(value) => setTypeFilter(value as TypeFilter)}
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="project">Projects</SelectItem>
                <SelectItem value="consulting">Consulting Services</SelectItem>
                <SelectItem value="training">Training</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={featuredFilter}
              onValueChange={(value) =>
                setFeaturedFilter(value as FeaturedFilter)
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="featured">Featured on Home</SelectItem>
                <SelectItem value="not-featured">Not Featured</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {filteredPortfolio.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
                No portfolio items found.
              </div>
            ) : (
              filteredPortfolio.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{item.title}</h3>
                      {item.displayOnHome && (
                        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-brand-800">
                          Featured on Home
                        </span>
                      )}
                      <span className="rounded bg-slate-100 px-2 py-1 text-xs font-semibold text-brand-700">
                        {formatType(item.type)}
                      </span>
                    </div>

                    <SanitizedHtml
                      html={item.shortDescription}
                      className="mt-1 line-clamp-2 text-sm text-gray-600 [&_p]:mb-0 [&_strong]:font-semibold [&_em]:italic [&_a]:text-brand-600 [&_a]:underline [&_table]:text-xs [&_th]:text-xs [&_td]:text-xs [&_th]:border-gray-200 [&_td]:border-gray-200 [&_th]:px-1 [&_td]:px-1 [&_th]:py-0.5 [&_td]:py-0.5 [&_th]:bg-gray-50 [&_table]:border-collapse"
                    />

                    <p className="mt-2 text-xs text-gray-500">
                      {[
                        clients.find((c) => c.id === item.clientId)?.name,
                        item.sector,
                        item.fiscalYear,
                      ]
                        .filter(Boolean)
                        .join(" • ") || item.slug}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      title="Update Portfolio Item"
                      className="cursor-pointer hover:bg-brand-100 hover:text-brand-900"
                      onClick={() => navigate(`/admin/portfolio/edit/${item.slug}`)}
                    >
                      <Edit className="h-4 w-4 text-brand-900" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      title="Delete Portfolio Item"
                      className="cursor-pointer hover:bg-red-50 hover:text-red-600"
                      onClick={() => openDeleteDialog(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Portfolio Item</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600">
            Are you sure you want to delete this portfolio item? This action
            cannot be undone.
          </p>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
