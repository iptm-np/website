import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useContent } from '../../contexts/ContentContext';
import { toast } from 'sonner';
import { Edit, Trash2, X } from 'lucide-react';
import { GalleryForm, defaultGalleryForm } from './types';

export function GallerySection() {
  const { galleryImages, addGalleryImage, updateGalleryImage, deleteGalleryImage } = useContent();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<GalleryForm>(defaultGalleryForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.imageUrl) {
      toast.error('Please fill all fields');
      return;
    }
    if (editingId) {
      updateGalleryImage(editingId, form);
      toast.success('Gallery image updated');
      setEditingId(null);
    } else {
      addGalleryImage(form);
      toast.success('Gallery image added');
    }
    setForm(defaultGalleryForm);
  };

  const handleEdit = (image: typeof galleryImages[0]) => {
    setForm({
      title: image.title,
      category: image.category,
      imageUrl: image.imageUrl,
    });
    setEditingId(image.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(defaultGalleryForm);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Gallery Image' : 'Add New Gallery Image'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="gallery-title">Title</Label>
              <Input
                id="gallery-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Enter title"
              />
            </div>

            <div>
              <Label htmlFor="gallery-category">Category</Label>
              <Input
                id="gallery-category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Enter category"
              />
            </div>

            <div>
              <Label htmlFor="gallery-image">Image URL</Label>
              <Input
                id="gallery-image"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? 'Update Image' : 'Add Image'}
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

      <Card>
        <CardHeader>
          <CardTitle>All Gallery Images ({galleryImages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {galleryImages.map((image) => (
              <div key={image.id} className="border rounded-lg overflow-hidden">
                <img src={image.imageUrl} alt={image.title} className="w-full h-48 object-cover" />
                <div className="p-3">
                  <p className="font-semibold text-sm mb-1">{image.title}</p>
                  <p className="text-xs text-gray-500 mb-2">{image.category}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(image)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        deleteGalleryImage(image.id);
                        toast.success('Image deleted');
                      }}
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
