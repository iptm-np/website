import { useEffect, useState } from "react";
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
import { Checkbox } from "../../components/ui/checkbox";
import { ImageUpload } from "../../components/ui/imageupload";
import { useContent } from "../../contexts/ContentContext";
import { toast } from "sonner";
import { ArrowLeft, UserCheck } from "lucide-react";
import { TeamForm as TeamFormType, defaultTeamForm } from "./types";

export function TeamForm() {
  const { teamMembers, addTeamMember, updateTeamMember } = useContent();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();

  // editingId is the real Firestore id, derived from the found member.
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TeamFormType>(defaultTeamForm);
  const [notFound, setNotFound] = useState(false);

  // Load the member being edited once data is available.
  useEffect(() => {
    if (!slug) {
      setForm(defaultTeamForm);
      setEditingId(null);
      return;
    }

    const existing = teamMembers.find((m) => m.slug === slug);
    if (existing) {
      setEditingId(existing.id);
      setForm({
        name: existing.name,
        position: existing.position,
        bio: existing.bio,
        imageUrl: existing.imageUrl,
        slug: existing.slug,
        isLeadership: existing.isLeadership || false,
      });
      setNotFound(false);
    } else if (teamMembers.length > 0) {
      setNotFound(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, teamMembers.length]);

  const goBackToList = () => navigate("/admin/team");

  const generateSlug = (name: string, existingId?: string) => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const slugExists = (slug: string) =>
      teamMembers.some((t) => t.slug === slug && t.id !== existingId);

    let slug = baseSlug;
    let counter = 1;

    while (slugExists(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name, editingId || undefined),
    }));
  };

  const currentLeadershipMember = teamMembers.find(
    (member) => member.isLeadership && member.id !== editingId,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.position || !form.bio || !form.imageUrl) {
      toast.error("Please fill all required fields");
      return;
    }

    // If new leadership selected, remove leadership from others
    if (form.isLeadership) {
      teamMembers.forEach((member) => {
        if (member.isLeadership && member.id !== editingId) {
          updateTeamMember(member.id, { ...member, isLeadership: false });
        }
      });
    }

    if (editingId) {
      updateTeamMember(editingId, form);
      toast.success("Team member updated successfully.");
    } else {
      addTeamMember(form);
      toast.success("Team member added successfully.");
    }

    goBackToList();
  };

  if (slug && notFound) {
    return (
      <Card>
        <CardContent className="space-y-4 p-8 text-center">
          <p className="text-gray-600">
            This team member could not be found. They may have been deleted.
          </p>
          <Button type="button" onClick={goBackToList} className="
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
">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Team
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="ghost"
        onClick={goBackToList}
        className="
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
"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Team
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {slug ? "Update Team Member" : "Add New Team Member"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Basic Info
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="team-name">Name *</Label>
                  <Input
                    id="team-name"
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>

                <div>
                  <Label htmlFor="team-position">Position *</Label>
                  <Input
                    id="team-position"
                    value={form.position}
                    onChange={(e) =>
                      setForm({ ...form, position: e.target.value })
                    }
                    placeholder="e.g. Managing Director"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="team-slug">Slug (Auto Generated)</Label>
                <Input
                  id="team-slug"
                  value={form.slug}
                  readOnly
                  className="bg-gray-50"
                  placeholder="Auto-generated from name"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL: /team/{form.slug || "member-name"}
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Bio
              </h3>

              <div>
                <Label htmlFor="team-bio">Bio *</Label>
                <Textarea
                  id="team-bio"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Write a short bio"
                  rows={4}
                />
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Photo
              </h3>

              <div>
                <ImageUpload
                  label="Profile Image *"
                  folder="team"
                  value={form.imageUrl}
                  onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
                />

                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="mt-3 h-24 w-24 rounded-full object-cover border"
                  />
                )}
              </div>
            </div>

            <div className="space-y-3 border-t pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Role
              </h3>

              <label className="flex items-start gap-3 rounded-lg border border-brand-200 bg-brand-50 p-4 text-sm cursor-pointer">
                <Checkbox
                  id="team-leadership"
                  checked={form.isLeadership || false}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, isLeadership: checked as boolean })
                  }
                  className="mt-0.5 border-brand-500 data-[state=checked]:bg-brand-600 data-[state=checked]:border-brand-600"
                />
                <span>
                  <span className="font-medium flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-brand-600" />
                    Leadership Position (Center Highlight)
                  </span>
                  <p className="text-gray-500 mt-1">
                    Only one person can hold the leadership position at a time.
                  </p>
                </span>
              </label>

              {currentLeadershipMember && form.isLeadership && (
                <div className="text-xs text-brand-700 bg-white border border-brand-200 rounded-md p-3">
                  <p className="font-medium">
                    Current leadership: {currentLeadershipMember.name} (
                    {currentLeadershipMember.position})
                  </p>
                  <p className="mt-1">
                    Saving this will transfer the leadership role to this member.
                  </p>
                </div>
              )}
            </div>
             <div className="flex justify-end gap-3 border-t pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={goBackToList}
                className="h-11 px-6 rounded-lg cursor-pointer border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="h-11 px-8 rounded-lg bg-brand-700 text-white hover:bg-brand-800 cursor-pointer"
              >
                {slug ? "Update Member" : "Add Member"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
