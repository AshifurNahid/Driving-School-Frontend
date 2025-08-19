import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Star,
  Calendar,
  Clock,
  BookOpen,
  Users,
  Award,
  MapPin,
  DollarSign,
  MoreVertical,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { Course } from '@/types/courses';
import { RootState, AppDispatch } from '@/redux/store';
import { getAdminCourses, deleteAdminCourse } from '@/redux/actions/adminAction';
import { useToast } from '@/hooks/use-toast';

interface CourseManagementProps {
  onEdit?: (course: Course) => void;
}

const CourseManagement: React.FC<CourseManagementProps> = ({ onEdit }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // Redux state
  const { 
    courses, 
    loading, 
    error, 
    deleteSuccess, 
    deleteMessage 
  } = useSelector((state: RootState) => state.adminCourseList);

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);

  // Helper function to get image URL
  const getImageUrl = (thumbnailPath: string | undefined) => {
    if (!thumbnailPath) return '/placeholder.svg';
    
    // If it's already a full URL, use it as-is
    if (thumbnailPath.startsWith('http')) {
      console.log(`Using full URL: ${thumbnailPath}`);
      return thumbnailPath;
    }
    
    // Clean the path - remove leading slash if present
    const cleanPath = thumbnailPath.startsWith('/') ? thumbnailPath.substring(1) : thumbnailPath;
    
    // Construct the full URL
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://dms-edu.runasp.net';
    const fullUrl = `${baseUrl}/${cleanPath}`;
    console.log(`Constructed URL: ${fullUrl} from path: ${thumbnailPath}`);
    return fullUrl;
  };

  // Get unique categories and levels from courses
  const categories = Array.from(new Set(courses?.map(course => course.category).filter(Boolean) || []));
  const levels = Array.from(new Set(courses?.map(course => course.level).filter(Boolean) || []));
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && course.status === 1) ||
                         (statusFilter === 'inactive' && course.status === 0);
    
    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  })?.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'title':
        aValue = a.title?.toLowerCase() || '';
        bValue = b.title?.toLowerCase() || '';
        break;
      case 'price':
        aValue = a.price || 0;
        bValue = b.price || 0;
        break;
      case 'rating':
        aValue = a.rating || 0;
        bValue = b.rating || 0;
        break;
      case 'created_at':
        aValue = new Date(a.created_at || 0).getTime();
        bValue = new Date(b.created_at || 0).getTime();
        break;
      default:
        aValue = a.title?.toLowerCase() || '';
        bValue = b.title?.toLowerCase() || '';
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  }) || [];

  // Handle delete
  const handleDeleteClick = (course: Course) => {
    setCourseToDelete(course);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (courseToDelete?.id) {
      dispatch(deleteAdminCourse(courseToDelete.id));
      setDeleteDialogOpen(false);
      setCourseToDelete(null);
    }
  };

  // Handle course view
  const handleViewCourse = (courseId: number | undefined) => {
    if (courseId) {
      navigate(`/course/${courseId}`);
    }
  };

  // Handle course edit
  const handleEditCourse = (course: Course) => {
    if (onEdit) {
      onEdit(course);
    } else {
      navigate(`/course/${course.id}/edit`);
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating 
                ? 'text-yellow-400 fill-yellow-400' 
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
  };

  // Get status badge
  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs px-1 py-0">
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 text-xs px-1 py-0">
        Inactive
      </Badge>
    );
  };

  // Get course type badge
  const getCourseTypeBadge = (courseType: number) => {
    return courseType === 1 ? (
      <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs px-1 py-0">
        Online
      </Badge>
    ) : (
      <Badge variant="outline" className="text-purple-600 border-purple-600 text-xs px-1 py-0">
        Physical
      </Badge>
    );
  };

  // Show toast on delete success
  useEffect(() => {
    if (deleteSuccess) {
      toast({
        title: "Course Deleted",
        description: deleteMessage || "Course successfully deleted.",
      });
      // Refetch courses
      dispatch(getAdminCourses(1, 11));
    }
  }, [deleteSuccess, deleteMessage, dispatch, toast]);

  // Fetch courses on mount
  useEffect(() => {
    dispatch(getAdminCourses(1, 11));
  }, [dispatch]);

  // Card component for grid view
  const CourseCard: React.FC<{ course: Course; index: number }> = ({ course, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
      className="group"
    >
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-gray-800">
        {/* Thumbnail */}
        <div className="relative h-32 overflow-hidden">
          <img
            src={getImageUrl(course.thumbnail_photo_path)}
            alt={course.title || 'Course thumbnail'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              console.error(`Failed to load image: ${getImageUrl(course.thumbnail_photo_path)}`);
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          <div className="absolute top-2 right-2 flex gap-1">
            {getStatusBadge(course.status || 0)}
            {getCourseTypeBadge(course.course_type || 0)}
          </div>
          <div className="absolute bottom-2 left-2">
            <Badge className="bg-black/70 text-white border-0 text-xs px-2 py-1">
              {formatPrice(course.price || 0)}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-2">
            {/* Title and Category */}
            <div>
              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors line-clamp-1">
                {course.title || 'Untitled Course'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {course.category?.replace(/-/g, ' ') || 'Uncategorized'}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
              {course.description || 'No description available'}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{course.duration ? `${course.duration}h` : 'Self-paced'}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span>{course.total_no_of_quizzes || course.total_number_of_quizzes || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{course.total_reviews || 0}</span>
              </div>
            </div>

            {/* Rating and Level */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= (course.rating || 0) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                  ({(course.rating || 0).toFixed(1)})
                </span>
              </div>
              <Badge variant="secondary" className="text-xs px-2 py-0">
                {course.level || 'Not specified'}
              </Badge>
            </div>

            {/* Created Date */}
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{course.created_at ? formatDate(course.created_at) : 'Unknown'}</span>
            </div>
          </div>
        </CardContent>

        {/* Actions */}
        <div className="px-4 pb-3">
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-xs h-7"
              onClick={() => handleViewCourse(course.id)}
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 w-7 p-0"
              onClick={() => handleEditCourse(course)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-7 w-7 p-0"
              onClick={() => handleDeleteClick(course)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  // List item component for list view
  const CourseListItem: React.FC<{ course: Course; index: number }> = ({ course, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4">
          {/* Thumbnail */}
          <div className="relative w-16 h-12 flex-shrink-0 rounded-md overflow-hidden">
            <img
              src={getImageUrl(course.thumbnail_photo_path)}
              alt={course.title || 'Course thumbnail'}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error(`Failed to load image: ${getImageUrl(course.thumbnail_photo_path)}`);
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                  {course.title || 'Untitled Course'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                  {course.description || 'No description available'}
                </p>
              </div>
              
              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleViewCourse(course.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditCourse(course)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Course
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteClick(course)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Course
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                <span>{formatPrice(course.price || 0)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{course.duration ? `${course.duration}h` : 'Self-paced'}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                <span>{course.total_no_of_quizzes || course.total_number_of_quizzes || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{course.total_reviews || 0}</span>
              </div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= (course.rating || 0) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs">({(course.rating || 0).toFixed(1)})</span>
              </div>
            </div>

            {/* Badges Row */}
            <div className="flex items-center gap-1 mt-2">
              {getStatusBadge(course.status || 0)}
              {getCourseTypeBadge(course.course_type || 0)}
              <Badge variant="secondary" className="text-xs px-1 py-0">
                {course.level || 'Not specified'}
              </Badge>
              <Badge variant="outline" className="text-xs px-1 py-0 capitalize">
                {course.category?.replace(/-/g, ' ') || 'Uncategorized'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Course Management</h2>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Course Management</h2>
        </div>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-red-600 dark:text-red-400">Error loading courses: {error}</p>
            <Button 
              onClick={() => dispatch(getAdminCourses(1, 11))} 
              className="mt-3"
              variant="outline"
              size="sm"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Course Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage your courses, content, and settings
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium text-sm"
          onClick={() => navigate("/upload-course")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Course
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category} className="capitalize">
                      {category.replace(/-/g, ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {levels.map(level => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date Created</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>

              <div className="flex gap-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredCourses.length} of {courses?.length || 0} courses
          </div>
        </CardContent>
      </Card>

      {/* Course List */}
      <AnimatePresence mode="wait">
        {filteredCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No courses found
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {searchTerm || categoryFilter !== 'all' || levelFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first course.'}
                </p>
                <Button onClick={() => navigate("/upload-course")} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredCourses.map((course, index) => (
                  <CourseCard key={course.id} course={course} index={index} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCourses.map((course, index) => (
                  <CourseListItem key={course.id} course={course} index={index} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the course
              "{courseToDelete?.title}" and all of its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseManagement;
