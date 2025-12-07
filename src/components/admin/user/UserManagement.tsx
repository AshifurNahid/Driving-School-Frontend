import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
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
import { getAdminUserDetails, deleteAdminUser, getAdminRoles, updateAdminRole, getAdminUsers, createAdminUser } from "@/redux/actions/adminAction";
import { RootState, AppDispatch } from "@/redux/store";
import { User } from '@/types/user';
import UserDetailsModal from "@/components/admin/UserDetailsModal";
import UserRoleEditModal from "@/components/admin/UserRoleEditModal";
import ReactPaginate from "react-paginate";
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { getAdminRegionList } from '@/redux/actions/adminAction';
import { Region } from '@/types/region';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const UserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [birthDateOpen, setBirthDateOpen] = useState(false);
  const [permitDateOpen, setPermitDateOpen] = useState(false);
  const [form, setForm] = useState({
    regionId: '', firstName: '', lastName: '', birthYear: '', birthMonth: '', birthDay: '',
    address1: '', address2: '', city: '', state: '', postal: '',
    studentEmail: '', parentEmail: '', studentPhone: '', parentPhone: '',
    permitYear: '', permitMonth: '', permitDay: '',
    hasLicenseAnotherCountry: '', drivingExperience: '',
    password: '', confirmPassword: '', agreements: [null, null, null, null] as (boolean | null)[],
  });
  const [formErrors, setFormErrors] = useState<string | null>(null);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const pageSize = 10;

  const birthDateValue =
    form.birthYear && form.birthMonth && form.birthDay
      ? new Date(`${form.birthYear}-${form.birthMonth.toString().padStart(2, '0')}-${form.birthDay.toString().padStart(2, '0')}`)
      : undefined;

  const permitDateValue =
    form.permitYear && form.permitMonth && form.permitDay
      ? new Date(`${form.permitYear}-${form.permitMonth.toString().padStart(2, '0')}-${form.permitDay.toString().padStart(2, '0')}`)
      : undefined;

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

  const { loading: createLoading, success: createSuccess, error: createError } = useSelector(
    (state: RootState) => state.adminUserCreate
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

  const { regions } = useSelector((state: RootState) => state.regionList);

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

  const AGREE_TEXTS = [
    'I agree that 50% of the Certificate Programs needs to be paid before Online portion begins and the remaining 50% before 1st IN CAR lesson.',
    'Online learning is to be completed within 90 days from payment. If an extension is needed, student is required to let instructor know.',
    'Student must be ready to the satisfaction of the Instructor before road test is booked.',
    'Refund Policy - If Online training has started but not completed, no refund will be given. Once IN-CAR Training has begun the refund will be based on number of sessions completed, for that portion of payment.',
  ];

  const handleFieldChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBirthDateChange = (date?: Date) => {
    if (!date) {
      setForm((prev) => ({ ...prev, birthYear: '', birthMonth: '', birthDay: '' }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      birthYear: date.getFullYear().toString(),
      birthMonth: (date.getMonth() + 1).toString(),
      birthDay: date.getDate().toString(),
    }));
  };

  const handlePermitDateChange = (date?: Date) => {
    if (!date) {
      setForm((prev) => ({ ...prev, permitYear: '', permitMonth: '', permitDay: '' }));
      return;
    }
    setForm((prev) => ({
      ...prev,
      permitYear: date.getFullYear().toString(),
      permitMonth: (date.getMonth() + 1).toString(),
      permitDay: date.getDate().toString(),
    }));
  };

  const handleAgreement = (idx: number, value: string) => {
    setForm((prev) => ({ ...prev, agreements: prev.agreements.map((a, i) => i === idx ? value === 'agree' : a) }));
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

  useEffect(() => {
    if (createUserModalOpen && (!regions || regions.length === 0)) {
      dispatch(getAdminRegionList());
    }
  }, [createUserModalOpen, dispatch, regions]);

  useEffect(() => {
    if (createSuccess) {
      toast({
        title: "User Created",
        description: "The user was created successfully.",
      });
      dispatch(getAdminUsers(currentPage, pageSize));
      setCreateUserModalOpen(false);
      setForm({
        regionId: '', firstName: '', lastName: '', birthYear: '', birthMonth: '', birthDay: '',
        address1: '', address2: '', city: '', state: '', postal: '',
        studentEmail: '', parentEmail: '', studentPhone: '', parentPhone: '',
        permitYear: '', permitMonth: '', permitDay: '',
        hasLicenseAnotherCountry: '', drivingExperience: '',
        password: '', confirmPassword: '', agreements: [null, null, null, null],
      });
      setFormErrors(null);
    }
    if (createError) {
      toast({
        title: "User Creation Failed",
        description: createError,
        variant: "destructive",
      });
    }
  }, [createSuccess, createError, toast, dispatch, currentPage]);

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

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();

    const requiredFields = [
      { value: form.regionId, label: 'Region' },
      { value: form.firstName, label: 'First Name' },
      { value: form.lastName, label: 'Last Name' },
      { value: form.address1, label: 'Street Address' },
      { value: form.city, label: 'City' },
      { value: form.state, label: 'State' },
      { value: form.postal, label: 'Postal Code' },
      { value: form.studentEmail, label: 'Student Email' },
      { value: form.studentPhone, label: 'Student Phone' },
      { value: form.drivingExperience, label: 'Driving Experience' },
      { value: form.password, label: 'Password' },
      { value: form.confirmPassword, label: 'Confirm Password' },
    ];

    const missingFields = requiredFields
      .filter((field) => !field.value || (typeof field.value === 'string' && field.value.trim() === ''))
      .map((field) => field.label);

    if (missingFields.length > 0) {
      setFormErrors(`Please fill the following fields: ${missingFields.join(', ')}.`);
      setValidationDialogOpen(true);
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFormErrors('Passwords do not match');
      setValidationDialogOpen(true);
      return;
    }

    if (!form.agreements.every((a) => a === true)) {
      setFormErrors('All agreements must be accepted.');
      setValidationDialogOpen(true);
      return;
    }

    if (!birthDateValue || isNaN(birthDateValue.getTime())) {
      setFormErrors('Birth date is required.');
      setValidationDialogOpen(true);
      return;
    }

    const ageDate = new Date(
      `${birthDateValue.getFullYear()}-${(birthDateValue.getMonth() + 1).toString().padStart(2, '0')}-${birthDateValue
        .getDate()
        .toString()
        .padStart(2, '0')}`
    );
    let age = today.getFullYear() - ageDate.getFullYear();
    const m = today.getMonth() - ageDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < ageDate.getDate())) {
      age--;
    }
    if (age < 16) {
      setFormErrors('User must be at least 16 years old.');
      setValidationDialogOpen(true);
      return;
    }

    if (!permitDateValue || isNaN(permitDateValue.getTime())) {
      setFormErrors("Learner's permit issue date is required.");
      setValidationDialogOpen(true);
      return;
    }

    const permitDate = new Date(
      `${permitDateValue.getFullYear()}-${(permitDateValue.getMonth() + 1).toString().padStart(2, '0')}-${permitDateValue
        .getDate()
        .toString()
        .padStart(2, '0')}`
    );
    if (permitDate > today) {
      setFormErrors("Learner's permit issue date cannot be in the future.");
      setValidationDialogOpen(true);
      return;
    }

    const payload = {
      region_id: form.regionId,
      first_name: form.firstName,
      last_name: form.lastName,
      birth_date: {
        year: birthDateValue.getFullYear(),
        month: birthDateValue.getMonth() + 1,
        day: birthDateValue.getDate(),
      },
      address: {
        street_address: form.address1,
        street_address2: form.address2,
        city: form.city,
        state: form.state,
        postal: form.postal,
      },
      student_email: form.studentEmail,
      parent_email: form.parentEmail,
      student_phone: form.studentPhone,
      parent_phone: form.parentPhone,
      learners_permit_issue_date: {
        year: permitDateValue.getFullYear(),
        month: permitDateValue.getMonth() + 1,
        day: permitDateValue.getDate(),
      },
      has_license_from_another_country: form.hasLicenseAnotherCountry,
      driving_experience: form.drivingExperience,
      password: form.password,
      agreements: {
        paid_policy: form.agreements[0] === true,
        completion_policy: form.agreements[1] === true,
        instructor_ready_policy: form.agreements[2] === true,
        refund_policy: form.agreements[3] === true,
      }
    };

    setFormErrors(null);
    setValidationDialogOpen(false);
    dispatch(createAdminUser(payload));
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
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => setCreateUserModalOpen(true)}
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

      <Dialog open={createUserModalOpen} onOpenChange={setCreateUserModalOpen}>
        <DialogContent className="w-[95vw] max-w-5xl max-h-[92vh]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <p className="text-sm text-slate-500">Fill out the same details as the registration form to create a user.</p>
          </DialogHeader>
          <ScrollArea className="max-h-[78vh] pr-2">
            <form className="space-y-6" onSubmit={handleCreateUserSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Region</Label>
                <Select value={form.regionId} onValueChange={(val) => handleFieldChange('regionId', val)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions?.map((region: Region) => (
                      <SelectItem
                        key={region.id || region.region_name}
                        value={(region.id ?? region.region_name ?? '').toString()}
                      >
                        {region.region_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={form.firstName} onChange={(e) => handleFieldChange('firstName', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={form.lastName} onChange={(e) => handleFieldChange('lastName', e.target.value)} required />
                </div>
              </div>
              </div>

              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Popover open={birthDateOpen} onOpenChange={setBirthDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {birthDateValue ? birthDateValue.toLocaleDateString() : 'Select date of birth'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0 w-auto">
                    <CalendarPicker
                      mode="single"
                      selected={birthDateValue}
                      onSelect={(date) => {
                        handleBirthDateChange(date || undefined);
                        setBirthDateOpen(false);
                      }}
                      disabled={(date) => date > new Date()}
                      className="bg-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Street Address</Label>
                  <Input value={form.address1} onChange={(e) => handleFieldChange('address1', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Street Address 2</Label>
                  <Input value={form.address2} onChange={(e) => handleFieldChange('address2', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={form.city} onChange={(e) => handleFieldChange('city', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={form.state} onChange={(e) => handleFieldChange('state', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Postal Code</Label>
                  <Input value={form.postal} onChange={(e) => handleFieldChange('postal', e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Student Email</Label>
                  <Input type="email" value={form.studentEmail} onChange={(e) => handleFieldChange('studentEmail', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Parent Email</Label>
                  <Input type="email" value={form.parentEmail} onChange={(e) => handleFieldChange('parentEmail', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Student Phone</Label>
                  <Input value={form.studentPhone} onChange={(e) => handleFieldChange('studentPhone', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Parent Phone</Label>
                  <Input value={form.parentPhone} onChange={(e) => handleFieldChange('parentPhone', e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Learner's Permit Issue Date</Label>
                <Popover open={permitDateOpen} onOpenChange={setPermitDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {permitDateValue ? permitDateValue.toLocaleDateString() : 'Select permit issue date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0 w-auto">
                    <CalendarPicker
                      mode="single"
                      selected={permitDateValue}
                      onSelect={(date) => {
                        handlePermitDateChange(date || undefined);
                        setPermitDateOpen(false);
                      }}
                      disabled={(date) => date > new Date()}
                      className="bg-white"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Has License From Another Country?</Label>
                  <Select value={form.hasLicenseAnotherCountry} onValueChange={(val) => handleFieldChange('hasLicenseAnotherCountry', val)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Driving Experience</Label>
                  <Input value={form.drivingExperience} onChange={(e) => handleFieldChange('drivingExperience', e.target.value)} required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Input type="password" value={form.password} onChange={(e) => handleFieldChange('password', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" value={form.confirmPassword} onChange={(e) => handleFieldChange('confirmPassword', e.target.value)} required />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Agreements</Label>
                {AGREE_TEXTS.map((text, idx) => (
                  <div key={idx} className="rounded-md border border-slate-200 dark:border-slate-700 p-3 space-y-2 bg-slate-50/60 dark:bg-slate-800/40">
                    <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">{idx + 1}. {text}</p>
                    <RadioGroup
                      className="flex flex-wrap gap-6"
                      value={
                        form.agreements[idx] === null
                          ? ''
                          : form.agreements[idx]
                          ? 'agree'
                          : 'disagree'
                      }
                      onValueChange={(val) => handleAgreement(idx, val)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id={`agree-${idx}`} value="agree" />
                        <Label htmlFor={`agree-${idx}`} className="text-sm">I AGREE</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id={`disagree-${idx}`} value="disagree" />
                        <Label htmlFor={`disagree-${idx}`} className="text-sm">I DO NOT AGREE</Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 pb-2">
                <Button type="button" variant="outline" onClick={() => setCreateUserModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </form>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={validationDialogOpen && !!formErrors}
        onOpenChange={(open) => {
          setValidationDialogOpen(open);
          if (!open) {
            setFormErrors(null);
          }
        }}
      >
        <AlertDialogContent className="max-w-md bg-white/95 backdrop-blur dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-700 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold text-slate-900 dark:text-slate-100">Action Needed</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-600 dark:text-slate-300">
              {formErrors}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md" onClick={() => setValidationDialogOpen(false)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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