import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useContent } from '../../contexts/ContentContext';
import { toast } from 'sonner';
import { Edit, Trash2, X } from 'lucide-react';
import { PortfolioItem, ProjectMetadata, defaultProjectFormData } from '../../../types/portfolio.types';

export function ProjectsSection() {
  const { projects, addPortfolioItem, updatePortfolioItem, deletePortfolioItem } = useContent();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'completed'>('all');
  const [form, setForm] = useState(defaultProjectFormData);

  const generateSlug = (title: string, existingId?: string) => {
    let baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const slugExists = (slug: string) =>
      projects.some((p) => p.slug === slug && p.id !== existingId);
    let slug = baseSlug;
    let counter = 1;
    while (slugExists(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    return slug;
  };

  const handleTitleChange = (title: string) => {
    const slug = generateSlug(title, editingId || undefined);
    setForm({ ...form, title, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.shortDescription || !form.sector || !form.featuredImage) {
      toast.error('Please fill all required fields');
      return;
    }

    const metadata = form.metadata as ProjectMetadata;
    if (!metadata.startDate || !metadata.endDate) {
      toast.error('Project start and end dates are required');
      return;
    }

    try {
      if (editingId) {
        await updatePortfolioItem(editingId, form);
        toast.success('Project updated successfully');
        setEditingId(null);
      } else {
        await addPortfolioItem(form);
        toast.success('Project added successfully');
      }
      setForm(defaultProjectFormData);
    } catch (error) {
      toast.error(editingId ? 'Failed to update project' : 'Failed to add project');
      console.error(error);
    }
  };

  const handleEdit = (project: PortfolioItem) => {
    setForm({
      ...project,
      type: 'project',
    } as any);
    setEditingId(project.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(defaultProjectFormData);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deletePortfolioItem(id);
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error('Failed to delete project');
      console.error(error);
    }
  };

  const filteredProjects = projects.filter(
    (p) => statusFilter === 'all' || p.metadata.status === statusFilter
  );

  const metadata = form.metadata as ProjectMetadata;

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Project' : 'Add New Project'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="sector">Sector *</Label>
                <Input
                  id="sector"
                  value={form.sector}
                  onChange={(e) => setForm({ ...form, sector: e.target.value })}
                  placeholder="e.g., Water Supply"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="shortDescription">Short Description *</Label>
              <Textarea
                id="shortDescription"
                value={form.shortDescription}
                onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                placeholder="Brief description for lists"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  placeholder="Client name"
                />
              </div>
              <div>
                <Label htmlFor="fiscalYear">Fiscal Year</Label>
                <Input
                  id="fiscalYear"
                  value={form.fiscalYear}
                  onChange={(e) => setForm({ ...form, fiscalYear: e.target.value })}
                  placeholder="e.g., 2072/73"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contractAmount">Contract Amount (NRs.)</Label>
                <Input
                  id="contractAmount"
                  value={form.contractAmount}
                  onChange={(e) => setForm({ ...form, contractAmount: e.target.value })}
                  placeholder="e.g., 500,000.00"
                />
              </div>
              <div>
                <Label htmlFor="partnerFirms">Partner Firms</Label>
                <Input
                  id="partnerFirms"
                  value={form.partnerFirms}
                  onChange={(e) => setForm({ ...form, partnerFirms: e.target.value })}
                  placeholder="Comma-separated if multiple"
                />
              </div>
            </div>

            {/* Project-Specific Fields */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-4">Project Details</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="projectType">Project Type *</Label>
                  <Select
                    value={metadata.projectType}
                    onValueChange={(value: any) =>
                      setForm({
                        ...form,
                        metadata: { ...metadata, projectType: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Design and Build">Design and Build</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={metadata.status}
                    onValueChange={(value: any) =>
                      setForm({
                        ...form,
                        metadata: { ...metadata, status: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={metadata.startDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        metadata: { ...metadata, startDate: e.target.value },
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={metadata.endDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        metadata: { ...metadata, endDate: e.target.value },
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={metadata.location}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        metadata: { ...metadata, location: e.target.value },
                      })
                    }
                    placeholder="e.g., Kathmandu, Nepal"
                  />
                </div>
                <div>
                  <Label htmlFor="area">Project Area</Label>
                  <Input
                    id="area"
                    value={metadata.area}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        metadata: { ...metadata, area: e.target.value },
                      })
                    }
                    placeholder="e.g., 5,000 sq ft"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="overview">Project Overview</Label>
                <Textarea
                  id="overview"
                  value={metadata.overview}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      metadata: { ...metadata, overview: e.target.value },
                    })
                  }
                  placeholder="Detailed project overview"
                  rows={4}
                />
              </div>

              <div className="mt-4">
                <Label htmlFor="featuredImage">Featured Image URL *</Label>
                <Input
                  id="featuredImage"
                  value={form.featuredImage}
                  onChange={(e) => setForm({ ...form, featuredImage: e.target.value })}
                  placeholder="https://..."
                  required
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button type="submit" className="flex-1">
                {editingId ? 'Update Project' : 'Add Project'}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Projects List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Projects ({filteredProjects.length})
            </CardTitle>
            <Select
              value={statusFilter}
              onValueChange={(value: any) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredProjects.map((project) => (
              <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{project.title}</h3>
                      <span className="px-2 py-1 bg-brand-100 text-brand-600 rounded text-xs">
                        {project.sector}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          project.metadata.status === 'ongoing'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {project.metadata.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{project.shortDescription}</p>
                    <p className="text-xs text-gray-500">
                      {project.client && `Client: ${project.client}`}
                      {project.fiscalYear && ` • FY: ${project.fiscalYear}`}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(project)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
