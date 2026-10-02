import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '../../components/ui/dialog';
import { useState } from 'react';
import { useContent } from '../../contexts/ContentContext';
import { toast } from 'sonner';
import { Edit, Trash2, Plus } from 'lucide-react';
import { slugify } from '../../../utils/slug';

export function SectorsManagement() {
  const { sectors, deleteSector } = useContent();
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteSector(deleteTargetId);
      toast.success('Sector deleted successfully.');
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
    } catch (err: any) {
      toast.error(err?.message || 'Delete failed');
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sectors ({sectors.length})</CardTitle>
            <Button
              type="button"
              size="sm"
              onClick={() => navigate('/admin/sectors/add')}
              className="h-10 rounded-md px-5 font-semibold bg-brand-600 cursor-pointer text-white hover:bg-brand-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Sector
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {sectors.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
                No sectors yet.
              </div>
            ) : (
              sectors.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-3"
                >
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-gray-500">
                      /portfolio?sector={s.slug || slugify(s.name)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => navigate(`/admin/sectors/edit/${s.slug || slugify(s.name)}`)}
                       title="Update Sector"
                      className="cursor-pointer hover:bg-brand-100 hover:text-brand-900"
                    >
                      <Edit className="h-4 w-4 text-brand-900" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDeleteTargetId(s.id);
                        setDeleteDialogOpen(true);
                      }}
                      title="Delete Sector"
                      className="cursor-pointer hover:bg-red-100 hover:text-red-900"
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
            <DialogTitle>Delete Sector</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this sector? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
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

export default SectorsManagement;
