import { useNavigate } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "../../components/ui/dialog";
import { useState } from "react";
import { useContent } from "../../contexts/ContentContext";
import { toast } from "sonner";
import { Edit, Trash2, Plus, UserCheck } from "lucide-react";

export function TeamSection() {
  const { teamMembers, deleteTeamMember } = useContent();
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    try {
      await deleteTeamMember(deleteTargetId);
      toast.success("Team member deleted successfully.");
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Team Members ({teamMembers.length})</CardTitle>
             <Button
                type="button"
                size="sm"
                onClick={() => navigate("/admin/team/add")}
                className="h-10 rounded-md px-5 font-semibold bg-brand-600 cursor-pointer text-white hover:bg-brand-700 transition-colors"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {teamMembers.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
                No team members yet.
              </div>
            ) : (
              teamMembers.map((member) => (
                <div
                  key={member.id}
                  className={`border rounded-lg p-4 transition-all duration-200 hover:bg-gray-50 ${member.isLeadership ? "border-brand-300 bg-brand-50" : ""
                    }`}
                >
                  <div className="flex gap-4">
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-16 h-16 rounded-full object-cover border"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{member.name}</h3>

                        {member.isLeadership && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-brand-100 text-brand-700">
                            <UserCheck className="h-3 w-3" />
                            Leadership
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-brand-600">{member.position}</p>

                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {member.bio}
                      </p>

                      <p className="text-xs text-gray-400 mt-2">
                        /team/{member.slug}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        title="Update Team Member"
                        className="cursor-pointer hover:bg-brand-100 hover:text-brand-900"
                        onClick={() => navigate(`/admin/team/edit/${member.slug}`)}
                      >
                        <Edit className="h-4 w-4 text-brand-900" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        title="Delete Team Member"
                        className="cursor-pointer hover:bg-red-50 hover:text-red-600"
                        onClick={() => openDeleteDialog(member.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
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
            <DialogTitle>Delete Team Member</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600">
            Are you sure you want to delete this team member? This action cannot
            be undone.
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
