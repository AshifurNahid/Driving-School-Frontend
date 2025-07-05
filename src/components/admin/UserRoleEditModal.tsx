import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { User, UserRole } from "@/types/user";

interface UserRoleEditModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  roles: UserRole[];
  onSave: (roleId: number) => void;
  loading: boolean;
}

const UserRoleEditModal: React.FC<UserRoleEditModalProps> = ({ open, onClose, user, roles, onSave, loading }) => {
  const [selectedRole, setSelectedRole] = useState<number | undefined>(user?.role.id);

  useEffect(() => {
    setSelectedRole(user?.role.id);
  }, [user]);

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User Role</DialogTitle>
        </DialogHeader>
        <div>
          <div className="mb-4">
            <div className="font-medium">{user.full_name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
          <Select value={selectedRole?.toString()} onValueChange={val => setSelectedRole(Number(val))}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role.id} value={role.id.toString()}>
                  {role.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => selectedRole && onSave(selectedRole)}
            disabled={loading || !selectedRole || selectedRole === user.role.id}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserRoleEditModal;