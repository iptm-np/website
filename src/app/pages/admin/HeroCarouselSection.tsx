import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { ImageUpload } from "../../components/ui/imageupload";
import { useContent, HeroCarouselImage } from "../../contexts/ContentContext";
import { toast } from "sonner";
import { GripVertical, Trash2, ArrowUp, ArrowDown, Save, Images } from "lucide-react";

export function HeroCarouselSection() {
  const { heroImages, addHeroImage, deleteHeroImage, updateHeroImages } = useContent();
  const [saving, setSaving] = useState(false);
  const [reorderedImages, setReorderedImages] = useState<HeroCarouselImage[] | null>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Use reorderedImages if present (unsaved changes), otherwise use heroImages from context
  const displayImages = reorderedImages ?? heroImages;
  const hasUnsavedChanges = reorderedImages !== null;

  const handleImageUpload = async (url: string) => {
    if (!url) return;
    const maxOrder = displayImages.length > 0
      ? Math.max(...displayImages.map((img) => img.order))
      : -1;

    try {
      await addHeroImage({
        url,
        order: maxOrder + 1,
      });
      // Reset any unsaved reorder since we're adding a new image
      setReorderedImages(null);
      toast.success("Hero image added successfully");
    } catch {
      toast.error("Failed to add hero image");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHeroImage(id);
      // Reset any unsaved reorder
      setReorderedImages(null);
      toast.success("Hero image removed");
    } catch {
      toast.error("Failed to remove hero image");
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...displayImages];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    // Reassign orders
    const reordered = updated.map((img, i) => ({ ...img, order: i }));
    setReorderedImages(reordered);
  };

  const handleMoveDown = (index: number) => {
    if (index === displayImages.length - 1) return;
    const updated = [...displayImages];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    const reordered = updated.map((img, i) => ({ ...img, order: i }));
    setReorderedImages(reordered);
  };

  const handleSaveOrder = async () => {
    if (!reorderedImages) return;
    setSaving(true);
    try {
      await updateHeroImages(reorderedImages);
      setReorderedImages(null);
      toast.success("Carousel order saved");
    } catch {
      toast.error("Failed to save order");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = () => {
    setReorderedImages(null);
  };

  // Drag-and-drop handlers
  const handleDragStart = useCallback((index: number) => {
    dragItem.current = index;
  }, []);

  const handleDragEnter = useCallback((index: number) => {
    dragOverItem.current = index;
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }

    const updated = [...displayImages];
    const draggedItem = updated[dragItem.current];
    updated.splice(dragItem.current, 1);
    updated.splice(dragOverItem.current, 0, draggedItem);

    const reordered = updated.map((img, i) => ({ ...img, order: i }));
    setReorderedImages(reordered);

    dragItem.current = null;
    dragOverItem.current = null;
  }, [displayImages]);

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Add Hero Carousel Image</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            label="Hero Image"
            folder="hero-carousel"
            value=""
            onChange={handleImageUpload}
          />
          <p className="text-xs text-gray-500 mt-2">
            Recommended: landscape images at 1920×1080 or wider for best results.
          </p>
        </CardContent>
      </Card>

      {/* Current Images Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Carousel Images ({displayImages.length})
          </CardTitle>
          {hasUnsavedChanges && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDiscardChanges}
                className="cursor-pointer"
              >
                Discard
              </Button>
              <Button
                size="sm"
                onClick={handleSaveOrder}
                disabled={saving}
                className="bg-brand-700 text-white hover:bg-brand-800 cursor-pointer"
              >
                <Save className="h-4 w-4 mr-1" />
                {saving ? "Saving..." : "Save Order"}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {displayImages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Images className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No hero images configured</p>
              <p className="text-sm mt-1">
                Upload an image above to start building your hero carousel.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayImages.map((image, index) => (
                <div
                  key={image.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className={`flex items-center gap-4 p-3 rounded-lg border bg-white transition-all ${
                    dragItem.current === index
                      ? "opacity-50 border-brand-300"
                      : "hover:shadow-sm"
                  } ${hasUnsavedChanges ? "border-amber-300 bg-amber-50/30" : ""}`}
                >
                  {/* Drag Handle */}
                  <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  {/* Order Number */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>

                  {/* Image Preview */}
                  <div className="flex-shrink-0 w-40 h-24 rounded-lg overflow-hidden border bg-gray-100">
                    <img
                      src={image.url}
                      alt={`Hero image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Image URL (truncated) */}
                  <div className="flex-1 min-w-0 hidden sm:block">
                    <p className="text-xs text-gray-400 truncate">
                      {image.url}
                    </p>
                  </div>

                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="h-7 w-7 p-0 cursor-pointer"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={index === displayImages.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="h-7 w-7 p-0 cursor-pointer"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
