import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { useContent, ContactInfo } from "../../contexts/ContentContext";
import { toast } from "sonner";
import { Save, Building2, Mail, Phone, Clock } from "lucide-react";
import { SiInstagram, SiFacebook, SiYoutube, SiTiktok, SiX } from "react-icons/si";

const defaultContactInfo: ContactInfo = {
  address: "",
  email: "",
  phone: "",
  businessHours: "",
  instagram: "",
  facebook: "",
  youtube: "",
  tiktok: "",
  x: "",
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactInfoSection() {
  const { contactInfo, saveContactInfo } = useContent();
  const [form, setForm] = useState<ContactInfo>(defaultContactInfo);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactInfo, string>>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contactInfo) {
      setForm({
        address: contactInfo.address || "",
        email: contactInfo.email || "",
        phone: contactInfo.phone || "",
        businessHours: contactInfo.businessHours || "",
        instagram: contactInfo.instagram || "",
        facebook: contactInfo.facebook || "",
        youtube: contactInfo.youtube || "",
        tiktok: contactInfo.tiktok || "",
        x: contactInfo.x || "",
      });
    }
    setLoading(false);
  }, [contactInfo]);

  const validate = (): boolean => {
    const next: Partial<Record<keyof ContactInfo, string>> = {};

    if (!form.address.trim()) {
      next.address = "Office address is required";
    }

    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!emailRegex.test(form.email.trim())) {
      next.email = "Please enter a valid email address";
    }

    if (!form.phone.trim()) {
      next.phone = "Phone number is required";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setSaving(true);
    try {
      await saveContactInfo({
        address: form.address.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        businessHours: form.businessHours?.trim() || "",
        instagram: form.instagram?.trim(),
        facebook: form.facebook?.trim(),
        youtube: form.youtube?.trim(),
        tiktok: form.tiktok?.trim(),
        x: form.x?.trim(),
      });
      toast.success("Contact information updated");
    } catch {
      toast.error("Failed to save contact information");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          Loading contact information...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Office Details
              </h3>

              <div>
                <Label htmlFor="contact-address" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-brand-600" />
                  Office Address *
                </Label>
                <Textarea
                  id="contact-address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g. Ghattekulo-32, Kathmandu, Nepal"
                  rows={2}
                  className="mt-2"
                />
                {errors.address && (
                  <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                )}
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Contact Details
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="contact-email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-brand-600" />
                    Email Address *
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g. info@example.com"
                    className="mt-2"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contact-phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-brand-600" />
                    Phone Number *
                  </Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g. +977-9841707077"
                    className="mt-2"
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Additional
              </h3>

              <div>
                <Label htmlFor="contact-hours" className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-600" />
                  Business Hours
                </Label>
                <Input
                  id="contact-hours"
                  value={form.businessHours || ""}
                  onChange={(e) => setForm({ ...form, businessHours: e.target.value })}
                  placeholder="e.g. Sunday - Friday: 10:00 AM - 5:00 PM"
                  className="mt-2"
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Social Media Links
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  { key: "instagram", label: "Instagram", icon: SiInstagram, placeholder: "https://instagram.com/your-account" },
                  { key: "facebook", label: "Facebook", icon: SiFacebook, placeholder: "https://facebook.com/your-page" },
                  { key: "youtube", label: "YouTube", icon: SiYoutube, placeholder: "https://youtube.com/@your-channel" },
                  { key: "tiktok", label: "TikTok", icon: SiTiktok, placeholder: "https://tiktok.com/@your-account" },
                  { key: "x", label: "X", icon: SiX, placeholder: "https://x.com/your-account" },
                ].map(({ key, label, icon: Icon, placeholder }) => (
                  <div key={key}>
                    <Label htmlFor={`contact-${key}`} className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-brand-600" />
                      {label}
                    </Label>
                    <Input
                      id={`contact-${key}`}
                      type="url"
                      value={form[key as keyof ContactInfo] || ""}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="mt-2"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 border-t pt-5">
              <Button
                type="submit"
                disabled={saving}
                className="h-11 px-8 rounded-lg bg-brand-700 text-white hover:bg-brand-800 cursor-pointer disabled:opacity-60"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Contact Information"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
