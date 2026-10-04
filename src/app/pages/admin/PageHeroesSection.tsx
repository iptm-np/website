import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ImageUpload } from "../../components/ui/imageupload";
import { useContent, PageHeroImages } from "../../contexts/ContentContext";
import { toast } from "sonner";
import { Save, Image as ImageIcon } from "lucide-react";

const PAGES: { key: keyof PageHeroImages; label: string; hint: string }[] = [
  { key: "about", label: "About Us", hint: "/about" },
  { key: "companyProfile", label: "Company Profile", hint: "/company-profile" },
  { key: "portfolio", label: "Portfolio", hint: "/portfolio" },
  { key: "training", label: "Training", hint: "/training" },
  { key: "projects", label: "Projects", hint: "/projects" },
  { key: "contact", label: "Contact", hint: "/contact" },
  { key: "gallery", label: "Gallery", hint: "/gallery" },
  // { key: "companySector", label: "Company Sectors", hint: "/company-sector" },
];

export function PageHeroesSection() {
  const { pageHeroImages, updatePageHeroImages } = useContent();
  const [form, setForm] = useState<PageHeroImages>({});
  const [saving, setSaving] = useState(false);

  // sync local form once the context finishes loading from Firestore
  useEffect(() => {
    setForm((prev) =>
      Object.keys(prev).length === 0 ? { ...pageHeroImages } : prev
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageHeroImages]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePageHeroImages(form);
      toast.success("Hero backgrounds updated");
    } catch {
      toast.error("Failed to save hero backgrounds");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-brand-600" />
            Page Hero Backgrounds
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Upload a background image for each page&apos;s hero section. Leave a
            page empty to keep its default gradient background.
          </p>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {PAGES.map(({ key, label, hint }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="font-medium text-gray-800">{label}</span>
                  <span className="text-xs text-gray-400">{hint}</span>
                </div>

                {form[key] ? (
                  <div className="rounded-xl overflow-hidden border">
                    <img
                      src={form[key]}
                      alt={`${label} hero background preview`}
                      className="w-full h-28 object-cover"
                    />
                  </div>
                ) : null}

                <ImageUpload
                  label="Background Image"
                  folder="page-heroes"
                  value={form[key] || ""}
                  disabled={saving}
                  onChange={(url) => setForm((prev) => ({ ...prev, [key]: url }))}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end border-t pt-5 mt-6">
            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="h-11 px-8 rounded-lg bg-brand-700 text-white hover:bg-brand-800 cursor-pointer disabled:opacity-60"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Hero Backgrounds"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
