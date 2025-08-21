import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, Users, BookOpen, FileText, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/utils/axios';
import { RootState } from '@/redux/store';

const instructorSchema = z.object({
    instructor_name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
    course_id: z.string().optional()
});

type InstructorFormData = z.infer<typeof instructorSchema>;

const AdminInstructors = () => {
    const courses = useSelector((state: RootState) => state.adminCourseList.courses);
    const [instructors, setInstructors] = useState<any[]>([]);
    const [filteredInstructors, setFilteredInstructors] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingInstructor, setEditingInstructor] = useState<any | null>(null);
    const [deletingInstructor, setDeletingInstructor] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<InstructorFormData>({
        resolver: zodResolver(instructorSchema),
        defaultValues: {
            instructor_name: '',
            description: '',
            course_id: 'unassigned'
        }
    });

    useEffect(() => {
        const fetchInstructors = async () => {
            try {
                setIsLoading(true);
                const { data } = await api.get('/instructors');
                setInstructors(data.data);
                setFilteredInstructors(data.data);
            } catch (error) {
                console.error('Failed to fetch instructors:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInstructors();
    }, []);

    useEffect(() => {
        const filtered = instructors.filter(instructor =>
            instructor.instructor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            instructor.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            courses.find(c => c.id === instructor.course_id)?.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredInstructors(filtered);
    }, [searchTerm, instructors, courses]);

    const createInstructor = async (instructor: InstructorFormData) => {
        const { data } = await api.post('/instructors', instructor);
        const newInstructor = data.data;
        setInstructors(prev => [...prev, newInstructor]);
    };

    const updateInstructor = async (id: string, instructor: InstructorFormData) => {
        const { data } = await api.put(`/instructors/${id}`, instructor);
        setInstructors(prev => prev.map(i => (i.id === id ? data.data : i)));
    };

    const deleteInstructor = async (id: string) => {
        await api.delete(`/instructors/${id}`);
        setInstructors(prev => prev.filter(i => i.id !== id));
    };

    const onSubmit = async (data: InstructorFormData) => {
        try {
            // Convert "unassigned" back to empty string or undefined for API
            const submitData = {
                ...data,
                course_id: data.course_id === "unassigned" ? undefined : data.course_id
            };
            
            if (editingInstructor) {
                await updateInstructor(editingInstructor.id, submitData);
            } else {
                await createInstructor(submitData);
            }
            handleCloseDialog();
        } catch (error) {
            console.error('Failed to save instructor:', error);
        }
    };

    const handleEdit = (instructor: any) => {
        setEditingInstructor(instructor);
        form.reset({
            instructor_name: instructor.instructor_name,
            description: instructor.description || '',
            course_id: instructor.course_id ? instructor.course_id.toString() : 'unassigned'
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async () => {
        if (deletingInstructor) {
            try {
                await deleteInstructor(deletingInstructor.id);
                setIsDeleteDialogOpen(false);
                setDeletingInstructor(null);
            } catch (error) {
                console.error('Failed to delete instructor:', error);
            }
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingInstructor(null);
        form.reset();
    };

    const openDeleteDialog = (instructor: any) => {
        setDeletingInstructor(instructor);
        setIsDeleteDialogOpen(true);
    };

    const openAddDialog = () => {
        setEditingInstructor(null);
        form.reset();
        setIsDialogOpen(true);
    };

    const getInstructorAvatar = (name: string, index: number) => {
        const initial = name.charAt(0).toUpperCase();
        const avatarVariants = [
            // Gradient circles with different colors
            { bg: "bg-gradient-to-br from-blue-400 to-blue-600", text: "text-white" },
            { bg: "bg-gradient-to-br from-purple-400 to-purple-600", text: "text-white" },
            { bg: "bg-gradient-to-br from-green-400 to-green-600", text: "text-white" },
            { bg: "bg-gradient-to-br from-orange-400 to-orange-600", text: "text-white" },
            { bg: "bg-gradient-to-br from-pink-400 to-pink-600", text: "text-white" },
            { bg: "bg-gradient-to-br from-indigo-400 to-indigo-600", text: "text-white" },
            { bg: "bg-gradient-to-br from-teal-400 to-teal-600", text: "text-white" },
            { bg: "bg-gradient-to-br from-red-400 to-red-600", text: "text-white" },
        ];

        const variant = avatarVariants[index % avatarVariants.length];
        
        return (
            <div className="relative mr-3">
                {/* Main Avatar */}
                <div className={`w-10 h-10 ${variant.bg} rounded-full flex items-center justify-center shadow-lg ring-2 ring-white`}>
                    <span className={`text-sm font-semibold ${variant.text}`}>
                        {initial}
                    </span>
                </div>
                
                {/* Professional Badge Indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                    {getAvatarIcon(index)}
                </div>
            </div>
        );
    };

    const getAvatarIcon = (index: number) => {
        const icons = [
            // Different professional icons as SVGs
            <svg className="w-2.5 h-2.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>,
            <svg className="w-2.5 h-2.5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>,
            <svg className="w-2.5 h-2.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>,
            <svg className="w-2.5 h-2.5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>,
            <svg className="w-2.5 h-2.5 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>,
            <svg className="w-2.5 h-2.5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>,
            <svg className="w-2.5 h-2.5 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>,
            <svg className="w-2.5 h-2.5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
        ];
        
        return icons[index % icons.length];
    };

    const getInstructorStats = () => {
        const totalInstructors = instructors.length;
        const assignedInstructors = instructors.filter(i => i.course_id).length;
        const unassignedInstructors = instructors.filter(i => !i.course_id).length;
        
        return { totalInstructors, assignedInstructors, unassignedInstructors };
    };

    const stats = getInstructorStats();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                            Instructor Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300">
                            Manage instructors and their course assignments
                        </p>
                    </div>
                    <Button onClick={openAddDialog} className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Instructor
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Instructors</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalInstructors}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-green-600 dark:text-green-300" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Assigned</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.assignedInstructors}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Unassigned</p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.unassignedInstructors}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Table Card */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                                    All Instructors
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-300 mt-1">
                                    Manage instructor profiles and course assignments
                                </CardDescription>
                            </div>
                            <div className="relative w-full sm:w-80">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-4 h-4" />
                                <Input
                                    placeholder="Search instructors..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12 sm:py-16">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                            </div>
                        ) : filteredInstructors.length === 0 ? (
                            <div className="text-center py-12 sm:py-16">
                                <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    {searchTerm ? 'No instructors found' : 'No instructors yet'}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first instructor'}
                                </p>
                                {!searchTerm && (
                                    <Button onClick={openAddDialog} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add First Instructor
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-gray-50 dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800">
                                            <TableHead className="font-semibold text-gray-900 dark:text-white">Name</TableHead>
                                            <TableHead className="font-semibold text-gray-900 dark:text-white">Description</TableHead>
                                            <TableHead className="font-semibold text-gray-900 dark:text-white">Course</TableHead>
                                            <TableHead className="font-semibold text-gray-900 dark:text-white text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredInstructors.map((instructor: any, index) => {
                                            const assignedCourse = courses.find(c => c.id === instructor.course_id);
                                            return (
                                                <TableRow key={instructor.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                                    <TableCell className="py-3 sm:py-4">
                                                        <div className="flex items-center">
                                                            {getInstructorAvatar(instructor.instructor_name, index)}
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {instructor.instructor_name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-3 sm:py-4">
                                                        <div className="text-sm text-gray-900 dark:text-white max-w-xs">
                                                            {instructor.description ? (
                                                                <span className="line-clamp-2">{instructor.description}</span>
                                                            ) : (
                                                                <span className="text-gray-400 dark:text-gray-500 italic">No description</span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-3 sm:py-4">
                                                        {assignedCourse ? (
                                                            <Badge className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800">
                                                                {assignedCourse.title}
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700">
                                                                Not assigned
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="py-3 sm:py-4 text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <span className="sr-only">Open menu</span>
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => handleEdit(instructor)}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem 
                                                                    onClick={() => openDeleteDialog(instructor)}
                                                                    className="text-red-600"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Add/Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
                    <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:text-white">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold dark:text-white">
                                {editingInstructor ? 'Edit Instructor' : 'Add New Instructor'}
                            </DialogTitle>
                            <DialogDescription className="dark:text-gray-300">
                                {editingInstructor 
                                    ? 'Update the instructor information below.' 
                                    : 'Fill in the details to create a new instructor.'
                                }
                            </DialogDescription>
                        </DialogHeader>

                        <Separator className="my-4 dark:bg-gray-700" />

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="instructor_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                Instructor Name *
                                            </FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Enter instructor name" 
                                                    className="border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-white" 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                Description
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea 
                                                    placeholder="Brief description or bio..."
                                                    className="border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 resize-none dark:bg-gray-900 dark:text-white"
                                                    rows={3}
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="course_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                Course Assignment
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-900 dark:text-white">
                                                        <SelectValue placeholder="Select a course" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent className="dark:bg-gray-900 dark:text-white">
                                                    <SelectItem value="unassigned">No course assigned</SelectItem>
                                                    {courses.map(course => (
                                                        <SelectItem key={course.id} value={course.id.toString()}>
                                                            {course.title}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Separator className="my-6 dark:bg-gray-700" />

                                <div className="flex gap-3">
                                    <Button 
                                        type="submit" 
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        {editingInstructor ? 'Update Instructor' : 'Create Instructor'}
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={handleCloseDialog}
                                        className="flex-1 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                {/* Delete Confirmation Dialog */}
                <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                    <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:text-white">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold text-red-600 dark:text-red-400">
                                Delete Instructor
                            </DialogTitle>
                            <DialogDescription className="mt-2 dark:text-gray-300">
                                Are you sure you want to delete <strong>{deletingInstructor?.instructor_name}</strong>? 
                                This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>

                        <Separator className="my-4 dark:bg-gray-700" />

                        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <p className="text-sm text-red-800 dark:text-red-300">
                                        This will permanently remove the instructor from the system.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                className="flex-1"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Instructor
                            </Button>
                            <Button 
                                variant="outline" 
                                onClick={() => setIsDeleteDialogOpen(false)}
                                className="flex-1 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                                Cancel
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default AdminInstructors;