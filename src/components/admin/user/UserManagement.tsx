import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Download,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  UserPlus,
  Shield,
  ChevronDown,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAdminUserDetails, deleteAdminUser, getAdminRoles, updateAdminRole, getAdminUsers } from "@/redux/actions/adminAction";
import { RootState, AppDispatch } from "@/redux/store";
import { User } from '@/types/user';
import UserDetailsModal from "@/components/admin/UserDetailsModal";
import UserRoleEditModal from "@/components/admin/UserRoleEditModal";
import ReactPaginate from "react-paginate";
import { useToast } from '@/hooks/use-toast';

const UserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const pageSize = 10;

  const dispatch = useDispatch<AppDispatch>();
  const {
    users,
    totalUsers,
    totalPages, 
    hasNextPage, 
    hasPreviousPage, 
    loading: usersLoading, 
    error: usersError, 
    page 
  } = useSelector((state: RootState) => state.adminUserList);

  const { user: userDetails, loading: userDetailsLoading } = useSelector(
    (state: RootState) => state.adminUserDetails
  );
  
  const {
    loading: deleteLoading,
    success: deleteSuccess,
    message: deleteMessage
  } = useSelector((state: RootState) => state.adminUserDelete);

  const { roles, loading: rolesLoading } = useSelector(
    (state: RootState) => state.adminRoleList
  );
  
  const { 
    loading: roleUpdateLoading, 
    user: userDetail, 
    error: roleUpdateError 
  } = useSelector((state: RootState) => state.adminUserDetails);

  // Handle viewing user details
  const handleViewUser = (userId: number) => {
    dispatch(getAdminUserDetails(userId));
    setUserDetailsModalOpen(true);
  };

  // Handle deleting a user
  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      dispatch(deleteAdminUser(userId));
    }
  };

  // Handle editing user role
  const handleEditUser = (user: User) => {
    setEditUser(user);
    setEditUserModalOpen(true);
    if (!roles || roles.length === 0) {
      dispatch(getAdminRoles());
    }
  };

  // Save role change
  const handleSaveRole = (roleId: number) => {
    if (editUser) {
      dispatch(updateAdminRole(editUser.id, roleId));
      if (!roleUpdateLoading) {
        toast({
          title: "Role Updated",
          description: "User role updated successfully.",
        });
        setEditUserModalOpen(false);
      }
    }
  };

  // Show toast and refetch users after successful delete
  useEffect(() => {
    if (deleteSuccess) {
      toast({
        title: "User Deleted",
        description: deleteMessage || "User successfully deleted.",
      });
      dispatch(getAdminUsers());
    }
  }, [deleteSuccess, deleteMessage, dispatch, toast]);

  // Fetch users on mount and when page changes
  useEffect(() => {
    dispatch(getAdminUsers(currentPage, pageSize));
  }, [dispatch, currentPage]);

  // Filter users based on search term and filters
  const filteredUsers = users?.filter((user: User) => {
    console.log(user);
    const matchesSearch = user.first_name+user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role.title.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.status === 1) ||
                         (statusFilter === 'inactive' && user.status === 0);
    
    return matchesSearch && matchesRole && matchesStatus;
  }) || [];

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'instructor':
        return 'default';
      case 'admin':
        return 'destructive';
      case 'student':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusBadgeStyles = (status: number) => {
    return status === 1
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800"
      : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
  };

  // Display role as 'Student' for all except 'Admin'
  const getDisplayRole = (role: User['role']) => {
    if (!role || role.title.toLowerCase() !== 'admin') {
      return 'Student';
    }
    return 'Admin';
  };

  const handleOpenCreateModal = () => {
    navigate('/register');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            User Management
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Manage all users, roles, and permissions across your platform
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={handleOpenCreateModal}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Users</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalUsers.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-800/30 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Active Users</p>
                <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                  {filteredUsers.filter(user => user.status === 1).length}
                </p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-800/30 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Instructors</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {filteredUsers.filter(user => user.role.title === 'Instructor').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-800/30 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-pink-600 dark:text-pink-400">Students</p>
                <p className="text-3xl font-bold text-pink-900 dark:text-pink-100">
                  {filteredUsers.filter(user => user.role.title.toLowerCase() !== 'admin').length}
                </p>
              </div>
              <div className="h-12 w-12 bg-pink-100 dark:bg-pink-800/30 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border-slate-200 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40 h-11 border-slate-200 dark:border-slate-600">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 h-11 border-slate-200 dark:border-slate-600">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 overflow-hidden">
        <CardContent className="p-0">
          {usersLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading users...</p>
            </div>
          ) : usersError ? (
            <div className="p-12 text-center">
              <div className="h-12 w-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-red-600 dark:text-red-400">{usersError}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                      <th className="text-left p-2 sm:p-3 font-semibold text-slate-900 dark:text-slate-100">User</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-slate-900 dark:text-slate-100">Role</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-slate-900 dark:text-slate-100">Contact</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-slate-900 dark:text-slate-100">Status</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-slate-900 dark:text-slate-100">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map((user: User, index: number) => (
                      <tr 
                        key={user.id} 
                        className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-200 ${
                          index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-800/50'
                        }`}
                      >
                        <td className="p-2 sm:p-3">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Avatar className="h-12 w-12 ring-2 ring-slate-100 dark:ring-slate-700">
                              <AvatarImage
                                src={
                                  user.user_detail?.image_path ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(user.first_name+user.last_name)}&background=6366f1&color=ffffff`
                                }
                                alt={user.first_name+user.last_name}
                              />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                                {user.first_name+user.last_name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-semibold text-slate-900 dark:text-slate-100">
                                {user.first_name+user.last_name}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {getDisplayRole(user.role)}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-6">
                          <Badge 
                            variant={getRoleBadgeVariant(user.role.title)}
                            className="font-medium"
                          >
                            {user.role.title}
                          </Badge>
                        </td>
                        
                        <td className="p-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                <Phone className="h-3 w-3" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        
                        <td className="p-6">
                          <Badge
                            variant="outline"
                            className={`${getStatusBadgeStyles(user.status)} font-medium`}
                          >
                            {user.status === 1 ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        
                        <td className="p-6">
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleViewUser(user.id)}
                              className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-900/20 dark:hover:border-blue-700"
                            >
                              <Eye className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEditUser(user)}
                              className="h-8 w-8 p-0 hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-emerald-900/20 dark:hover:border-emerald-700"
                            >
                              <Edit className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={deleteLoading}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:border-red-700"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="h-16 w-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <Users className="h-8 w-8 text-slate-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                              No users found
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                              Try adjusting your search or filter criteria
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-800">
          <CardContent className="p-6">
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              breakLabel={"..."}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={(data) => dispatch(getAdminUsers(data.selected + 1, pageSize))}
              containerClassName={"pagination flex justify-center items-center gap-2"}
              pageClassName={""}
              pageLinkClassName={"px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors duration-200"}
              activeClassName={""}
              activeLinkClassName={"bg-blue-600 text-white border-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"}
              previousClassName={""}
              previousLinkClassName={"px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors duration-200"}
              nextClassName={""}
              nextLinkClassName={"px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors duration-200"}
              breakClassName={""}
              breakLinkClassName={"px-4 py-2 text-slate-400 dark:text-slate-500"}
              disabledClassName={"opacity-50 cursor-not-allowed"}
              forcePage={page - 1}
            />
          </CardContent>
        </Card>
      )}

      {/* Modals */}
      <UserDetailsModal
        open={userDetailsModalOpen}
        onClose={() => setUserDetailsModalOpen(false)}
        user={userDetails}
      />

      <UserRoleEditModal
        open={editUserModalOpen}
        onClose={() => setEditUserModalOpen(false)}
        user={editUser}
        roles={roles}
        onSave={handleSaveRole}
        loading={roleUpdateLoading}
      />

    </div>
  );
};

export default UserManagement;