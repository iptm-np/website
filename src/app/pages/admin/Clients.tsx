import { useNavigate } from 'react-router';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
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

export function ClientsManagement() {
  const { clients, deleteClient } = useContent();
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteClient(deleteTargetId);
      toast.success('Client deleted');
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
            <CardTitle>Clients ({clients.length})</CardTitle>
            <Button
              type="button"
              size="sm"
              onClick={() => navigate('/admin/clients/add')}
              className="h-10 rounded-md px-5 font-semibold bg-brand-600 cursor-pointer text-white hover:bg-brand-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {clients.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
                No clients yet.
              </div>
            ) : (
              clients.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-4 rounded-lg border p-3"
                >
                  <div className="flex items-center gap-4">
                    {c.logoUrl ? (
                      <img
                        src={c.logoUrl}
                        alt={c.name}
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                        No
                      </div>
                    )}
                    <div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-xs text-gray-500">
                        /portfolio?client={c.slug || slugify(c.name)}
                      </div>
                      <div className="text-xs text-gray-500">{c.website}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/admin/clients/edit/${c.slug || slugify(c.name)}`)}
                      title="Update Client"
                      className="cursor-pointer hover:bg-brand-100 hover:text-brand-900"
                    >
                      <Edit className="h-4 w-4 text-brand-900" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDeleteTargetId(c.id);
                        setDeleteDialogOpen(true);
                      }}
                      title="Delete Client"
                      className="cursor-pointer hover:bg-red-50 hover:text-red-600"
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
            <DialogTitle>Delete Client</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this client? This action cannot be undone.
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

export default ClientsManagement;
