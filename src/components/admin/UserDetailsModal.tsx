import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/user";

interface UserDetailsModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ open, onClose, user }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View detailed information about this user.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={user.user_detail?.image_path || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}`}
              alt={user.full_name}
            />
            <AvatarFallback>
              {user.full_name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold text-lg">{user.full_name}</div>
            <Badge variant={user.role.title === 'Instructor' ? 'default' : 'secondary'}>
              {user.role.title}
            </Badge>
            <div className="text-sm text-muted-foreground">{user.email}</div>
            <div className="text-sm text-muted-foreground">{user.phone}</div>
          </div>
        </div>
        <div className="space-y-2">
          <div><strong>Status:</strong> {user.status === 1 ? "Active" : "Inactive"}</div>
          <div><strong>Email Verified:</strong> {user.is_email_verified ? "Yes" : "No"}</div>
          <div><strong>Phone Verified:</strong> {user.is_phone_verified ? "Yes" : "No"}</div>
          <div><strong>Address:</strong> {user.user_detail?.address_line_one || "N/A"}</div>
          <div><strong>City:</strong> {user.user_detail?.city || "N/A"}</div>
          <div><strong>State:</strong> {user.user_detail?.state || "N/A"}</div>
          <div><strong>Postal Code:</strong> {user.user_detail?.postal_code || "N/A"}</div>
          <div><strong>Nationality:</strong> {user.user_detail?.nationality || "N/A"}</div>
        </div>
        <DialogClose asChild>
          <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded">Close</button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;