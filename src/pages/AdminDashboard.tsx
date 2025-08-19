import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  BarChart3,
  Settings,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  Filter,
  Search,
  Menu,
  Home,
  Shield,
  FileText,
  Calendar,
  Plus,
  Clock,
  Video,
  Brain,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useToast } from '@/hooks/use-toast';
import CourseEditDialog from '@/components/admin/CourseEditDialog';
import EnhancedCourseEditDialog from '@/components/admin/EnhancedCourseEditDialog';
import QuizManagement from '@/components/admin/QuizManagement';
import UserAnalytics from '@/components/admin/UserAnalytics';
import AdminAppointmentManagement from '@/components/admin/appointment/AdminAppointmentManagement';
import AppointmentManagement from '@/components/admin/appointment/AppointmentManagement';
import SlotPriceManagement from '@/pages/SlotPriceManagement';
import AdminSidebar from '@/components/admin/AdminSidebar';
import CourseManagement from '@/components/admin/CourseManagement';
import { RevenueChart, UserGrowthChart, CoursePerformanceChart, EngagementChart } from '@/components/admin/analytics/AnalyticsCharts';
import { useDispatch, useSelector } from "react-redux";
import { getAdminUserDetails, deleteAdminUser, getAdminRoles, updateAdminRole, getAdminUsers, getAdminCourses, deleteAdminCourse } from "@/redux/actions/adminAction";
import { RootState, AppDispatch } from "@/redux/store";
import { User } from "@/types/user";
import UserDetailsModal from "@/components/admin/UserDetailsModal";
import UserRoleEditModal from "@/components/admin/UserRoleEditModal";
import ReactPaginate from "react-paginate";
import AdminInstructors from './AdminInstructors';


const AdminDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || 'overview'
  );
  const [editingCourse, setEditingCourse] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [useEnhancedEditor, setUseEnhancedEditor] = useState(false);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentActiveTab, setAppointmentActiveTab] = useState('availability');
  const pageSize = 10;

  const dispatch = useDispatch<AppDispatch>();
  const { users, totalUsers, totalPages, hasNextPage, hasPreviousPage, loading: usersLoading, error: usersError, page } = useSelector(
    (state: RootState) => state.adminUserList
  );

  //  const { courses, totalCourses, loading: coursesLoading,  error: coursesError } = useSelector(
  //   (state: RootState) => state.guest_course
  // );

  const { user: userDetails, loading: userDetailsLoading } = useSelector((state: RootState) => state.adminUserDetails);
  const { loading: deleteLoading, success: deleteSuccess, message: deleteMessage } = useSelector((state: RootState) => state.adminUserDelete);
  const { roles, loading: rolesLoading } = useSelector((state: RootState) => state.adminRoleList);
  const { loading: roleUpdateLoading, user: userDetail, error: roleUpdateError } = useSelector((state: RootState) => state.adminUserDetails);
  const { loading: courseListLoading, courses, error: courseListError, deleteSuccess: courseDeleteSuccess, deleteMessage: courseDeleteMessage } = useSelector((state: RootState) => state.adminCourseList);

  // Handle viewing user details
  const handleViewUser = (userId: number) => {
    dispatch(getAdminUserDetails(userId));
    setUserDetailsModalOpen(true);
  };

  // Handle deleting a user
  const handleDeleteUser = (userId: number) => {
    dispatch(deleteAdminUser(userId));
  };

  const handleDeleteCourse = (courseId: number) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      dispatch(deleteAdminCourse(courseId));
    }
  };

  // Show toast and refetch users after successful delete
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
    if (deleteSuccess) {
      toast({
        title: "User Deleted",
        description: deleteMessage || "User successfully deleted.",
      });
      dispatch(getAdminUsers());
    }
  }, [deleteSuccess, deleteMessage, dispatch, toast, location.state]);

  // Show toast after successful course delete
  useEffect(() => {
    if (courseDeleteSuccess) {
      toast({
        title: "Course Deleted",
        description: courseDeleteMessage || "Course successfully deleted.",
      });
    }
  }, [courseDeleteSuccess, courseDeleteMessage, toast]);

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


  // Mock data
  const stats = {
    totalUsers,
    totalCourses: 12,
    totalRevenue: 2847592,
    activeUsers: 18493,
    pendingCourses: 23,
    instructors: 156,
    students: 52691
  };
  // Place this near the top of your AdminDashboard component
  // 
  const [pendingCourses, setPendingCourses] = useState([
    {
      id: 1,
      title: "Advanced React Patterns",
      instructor: "John Doe",
      category: "Web Development",
      submittedAt: "2024-01-15",
      status: "pending",
      description: "Learn advanced React patterns and best practices",
      price: 99.99,
      duration: "8 weeks",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
      featured: false,
      published: false,
      modules: [
        {
          id: "1",
          title: "Introduction to React Patterns",
          description: "Basic concepts and setup",
          order: 1,
          subsections: [
            {
              id: "1-1",
              title: "Getting Started",
              videoUrl: "https://example.com/video1",
              duration: "15 min",
              order: 1
            }
          ]
        }
      ],
      downloadableMaterials: ["https://example.com/react-guide.pdf"],
      tags: ["react", "javascript", "patterns"]
    },
    {
      id: 2,
      title: "Machine Learning Basics",
      instructor: "Jane Smith",
      category: "Data Science",
      submittedAt: "2024-01-14",
      status: "pending",
      description: "Introduction to machine learning concepts",
      price: 149.99,
      duration: "12 weeks",
      thumbnail: "https://images.unsplash.com/photo-1527474305487-b87b222841cc?w=300&h=200&fit=crop",
      featured: true,
      published: true,
      modules: [],
      downloadableMaterials: [],
      tags: ["machine learning", "python", "data science"]
    }
  ]);


  const handleEditCourse = (course) => {
    navigate(`/course/${course?.id}/edit`);
  };

  const handleSaveCourse = (updatedCourse) => {
    setPendingCourses(prev =>
      prev.map(course =>
        course?.id === updatedCourse.id ? updatedCourse : course
      )
    );
    setEditDialogOpen(false);
    setEditingCourse(null);
  };

  // const handleApproveCourse = (courseId) => {
  //   setPendingCourses(prev => 
  //     prev.map(course => 
  //       course?.id === courseId ? { ...course, status: 'approved' } : course
  //     )
  //   );
  //   toast({
  //     title: "Course approved",
  //     description: "Course has been approved and is now live.",
  //   });
  // };

  // const handleRejectCourse = (courseId) => {
  //   setPendingCourses(prev => 
  //     prev.map(course => 
  //       course?.id === courseId ? { ...course, status: 'rejected' } : course
  //     )
  //   );
  //   toast({
  //     title: "Course rejected",
  //     description: "Course has been rejected.",
  //     variant: "destructive"
  //   });
  // };

  // Mock courses data for quiz management
  const coursesForQuizzes = [
    {
      id: '1',
      title: 'Advanced React Patterns',
      modules: [
        { id: '1', title: 'Introduction to React Patterns' },
        { id: '2', title: 'Higher Order Components' },
        { id: '3', title: 'Render Props Pattern' }
      ]
    },
    {
      id: '2',
      title: 'Machine Learning Basics',
      modules: [
        { id: '4', title: 'ML Fundamentals' },
        { id: '5', title: 'Supervised Learning' },
        { id: '6', title: 'Unsupervised Learning' }
      ]
    }
  ];

  const handleDialogClose = (open) => {
    setEditDialogOpen(open);
    if (!open) {
      // Clear editing course after a short delay to prevent visual glitches
      setTimeout(() => {
        setEditingCourse(null);
      }, 100);
    }
  };

  // Fetch users on mount
  useEffect(() => {
    dispatch(getAdminUsers(currentPage, pageSize));
    dispatch(getAdminCourses(1, 11));
  }, [dispatch, currentPage]);

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-gray-900 flex">
      {/* New Sidebar Component */}
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        appointmentActiveTab={appointmentActiveTab}
        onAppointmentTabChange={setAppointmentActiveTab}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen bg-[#f8f9fa] dark:bg-gray-900">
        {/* Header */}
        <header className="bg-slate-100/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-700/60 shadow-sm px-6 py-5 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 rounded-lg flex items-center justify-center shadow-md">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm md:text-base font-medium">
                  Manage your platform efficiently
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Badge 
                variant="secondary" 
                className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 text-emerald-100 px-3 py-1.5 font-semibold shadow-lg backdrop-blur-sm"
              >
                <Shield className="h-3 w-3 mr-2" />
                Administrator
              </Badge>
              
              <Avatar className="h-10 w-10 shadow-lg ring-2 ring-blue-400/30">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                  AD
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 min-h-0 bg-[#f8f9fa] dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</div>
                    {/* <p className="text-xs text-muted-foreground">
                     <span className="text-green-600">+12.5%</span> from last month
                    </p> */}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.totalCourses.toLocaleString()}</div>
                    {/* <p className="text-xs text-muted-foreground">
                    //  <span className="text-green-600">+8.2%</span> from last month
                    </p> */}
                  </CardContent>
                </Card>

                {/* <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">${stats.totalRevenue.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+15.3%</span> from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.activeUsers.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+5.7%</span> from last week
                    </p>
                  </CardContent>
                </Card> */}
              </div>

              {/* Recent Activity */}
              {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Course Approvals</CardTitle>
                    <CardDescription>Courses waiting for review</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pendingCourses.slice(0, 3).map((course) => (
                        <div key={course?.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                          <div>
                            <div className="font-medium text-foreground">{course?.title}</div>
                            <div className="text-sm text-muted-foreground">by {course?.instructor}</div>
                          </div>
                          
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Platform Analytics</CardTitle>
                    <CardDescription>Key performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Instructors</span>
                        <span className="font-medium text-foreground">{stats.instructors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Students</span>
                        <span className="font-medium text-foreground">{stats.students.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Pending Reviews</span>
                        <span className="font-medium text-foreground">{stats.pendingCourses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Active Sessions</span>
                        <span className="font-medium text-foreground">2,847</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div> */}
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">User Management</h2>
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search users..." className="pl-10 w-64" />
                  </div>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="instructor">Instructors</SelectItem>
                      <SelectItem value="student">Students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    {usersLoading ? (
                      <div className="p-6 text-center text-muted-foreground">Loading users...</div>
                    ) : usersError ? (
                      <div className="p-6 text-center text-red-600">{usersError}</div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left p-4 font-medium text-foreground">User</th>
                            <th className="text-left p-4 font-medium text-foreground">Role</th>
                            <th className="text-left p-4 font-medium text-foreground">Email</th>
                            <th className="text-left p-4 font-medium text-foreground">Phone</th>
                            <th className="text-left p-4 font-medium text-foreground">Status</th>
                            <th className="text-left p-4 font-medium text-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users && users.length > 0 ? (
                            users.map((user: User) => (
                              <tr key={user.id} className="border-b border-border">
                                <td className="p-4">
                                  <div className="flex items-center">
                                    <Avatar className="h-10 w-10 mr-3">
                                      <AvatarImage
                                        src={
                                          user.user_detail?.image_path ||
                                          `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name)}`
                                        }
                                        alt={user.full_name}
                                      />
                                      <AvatarFallback>
                                        {user.full_name
                                          .split(" ")
                                          .map((n) => n[0])
                                          .join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium text-foreground">{user.full_name}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge variant={user.role.title === 'Instructor' ? 'default' : 'secondary'}>
                                    {user.role.title}
                                  </Badge>
                                </td>
                                <td className="p-4 text-muted-foreground">{user.email}</td>
                                <td className="p-4 text-muted-foreground">{user.phone}</td>
                                <td className="p-4">
                                  <Badge
                                    variant="outline"
                                    className={
                                      user.status === 1
                                        ? "text-green-600 border-green-600"
                                        : "text-orange-600 border-orange-600"
                                    }
                                  >
                                    {user.status === 1 ? "Active" : "Inactive"}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex space-x-2">
                                    <Button size="sm" variant="outline" onClick={() => handleViewUser(user.id)}>
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                                      <Edit className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="text-red-600 hover:text-red-700"
                                      onClick={() => handleDeleteUser(user.id)}
                                      disabled={deleteLoading}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="p-6 text-center text-muted-foreground">
                                No users found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Pagination */}
              <div className="mt-4">
                <ReactPaginate
                  previousLabel={"← Previous"}
                  nextLabel={"Next →"}
                  breakLabel={"..."}
                  pageCount={totalPages}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={(data) => dispatch(getAdminUsers(data.selected + 1, pageSize))}
                  containerClassName={"pagination flex justify-center mt-4"}
                  pageClassName={"mx-1"}
                  activeClassName={"font-bold text-blue-600"}
                  previousClassName={"mx-2"}
                  nextClassName={"mx-2"}
                  forcePage={page - 1}
                />
              </div>
            </div>
          )}



          {/* Course List Tab */}
          {activeTab === "course-list" && (
            <CourseManagement />
          )}

          {/* Appointment Management Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
            
              
          
              {/* Content based on sub-tab */}
              {appointmentActiveTab === 'availability' && (
                <div>
                  <AdminAppointmentManagement />
                </div>
              )}

              {appointmentActiveTab === 'requests' && (
                <div>
                  <AppointmentManagement />
                </div>
              )}

              {appointmentActiveTab === 'pricing' && (
                <div>
                  <SlotPriceManagement />
                </div>
              )}
            </div>
          )}

          
          {/* Instructor Management Tab */}

          {activeTab === 'instructors' && (
              <AdminInstructors/>
          )}


          {/* Quiz Management Tab */}
          {activeTab === 'quizzes' && (
            <QuizManagement courses={coursesForQuizzes} />
          )}

          {/* User Analytics Tab */}
          {activeTab === 'analytics' && (
            <UserAnalytics />
          )}

          {/* Reports & Analytics Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Reports & Analytics</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Revenue Analytics
                    </CardTitle>
                    <CardDescription>Monthly revenue and subscription trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RevenueChart />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      User Growth
                    </CardTitle>
                    <CardDescription>Student and instructor growth over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserGrowthChart />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="h-5 w-5 mr-2" />
                      Course Performance
                    </CardTitle>
                    <CardDescription>Course categories and enrollment statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CoursePerformanceChart />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Engagement Metrics
                    </CardTitle>
                    <CardDescription>User engagement and participation rates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EngagementChart />
                  </CardContent>
                </Card>
              </div>

              {/* Additional Analytics Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>Key insights and recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <h4 className="font-semibold text-green-800 dark:text-green-200">Strong Growth</h4>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        User base grew by 35% this quarter with high engagement rates.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200">Popular Categories</h4>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        Web Development and Design courses show highest demand.
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                      <h4 className="font-semibold text-orange-800 dark:text-orange-200">Improvement Area</h4>
                      <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                        Discussion activity could be enhanced with more interactive features.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Site Settings</h2>

              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Configure basic platform settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Site Name</label>
                      <Input defaultValue="EduPlatform" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Site Description</label>
                      <Input defaultValue="Learn and grow with expert instructors" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Contact Email</label>
                      <Input defaultValue="contact@eduplatform.com" className="mt-1" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Theme Settings</CardTitle>
                    <CardDescription>Customize the platform appearance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Default Theme</label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Primary Color</label>
                      <Input type="color" defaultValue="#3b82f6" className="mt-1 h-10 w-20" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Featured Content</CardTitle>
                    <CardDescription>Manage featured courses and instructors</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Featured Courses Limit</label>
                      <Input type="number" defaultValue="8" className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Auto-feature Top Rated</label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="enabled">Enabled</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    Save Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>

      {/* Course Edit Dialogs */}
      {editingCourse && (
        <>
          {useEnhancedEditor ? (
            <EnhancedCourseEditDialog
              course={editingCourse}
              open={editDialogOpen}
              onOpenChange={handleDialogClose}
              onSave={handleSaveCourse}
            />
          ) : (
            <CourseEditDialog
              course={editingCourse}
              open={editDialogOpen}
              onOpenChange={handleDialogClose}
              onSave={handleSaveCourse}
            />
          )}
        </>
      )}
      
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

export default AdminDashboard;
