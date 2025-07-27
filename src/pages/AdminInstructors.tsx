import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
    // Get courses from Redux store
    const courses = useSelector((state: RootState) => state.adminCourseList.courses);
    const [instructors, setInstructors] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingInstructor, setEditingInstructor] = useState<any | null>(null);

    const form = useForm<InstructorFormData>({
        resolver: zodResolver(instructorSchema),
    });

    useEffect(() => {
        const fetchInstructors = async () => {
            const { data } = await api.get('/instructors');
            setInstructors(data.data);
        };

        fetchInstructors();
    }, []);

    const createInstructor = async (instructor: InstructorFormData) => {
        const { data } = await api.post('/instructors', instructor);
        setInstructors(prev => [...prev, data.data]);
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
        if (editingInstructor) {
            await updateInstructor(editingInstructor.id, data);
        } else {
            await createInstructor(data);
        }
        setIsDialogOpen(false);
        setEditingInstructor(null);
        form.reset();
    };

    const handleEdit = async (instructor: any) => {
        setEditingInstructor(instructor);
        form.setValue('instructor_name', instructor.instructor_name);
        form.setValue('description', instructor.description);
        form.setValue('course_id', instructor.course_id.toString());
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        await deleteInstructor(id);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-5xl mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Instructors Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage instructors
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Instructor List</CardTitle>
                        <CardDescription>All created instructors with related courses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => { setEditingInstructor(null); form.reset(); }}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Instructor
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{editingInstructor ? 'Edit Instructor' : 'Add Instructor'}</DialogTitle>
                                    <DialogDescription>
                                        {editingInstructor ? 'Update instructor details' : 'Create a new instructor'}
                                    </DialogDescription>
                                </DialogHeader>

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="instructor_name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter instructor name" {...field} />
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
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder="Enter description" {...field} />
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
                                                    <FormLabel>Course</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select course" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
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

                                        <div className="flex gap-2 pt-4">
                                            <Button type="submit" className="flex-1">
                                                {editingInstructor ? 'Update' : 'Create'}
                                            </Button>
                                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>

                        <Table className="mt-6">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Course</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {instructors.map((inst: any) => (
                                    <TableRow key={inst.id}>
                                        <TableCell>{inst.instructor_name}</TableCell>
                                        <TableCell>{inst.description}</TableCell>
                                        <TableCell>
                                            {courses.find(c => c.id === inst.course_id)?.title || 'Unknown'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => handleEdit(inst)}>
                                                    <Edit className="w-3 h-3" />
                                                </Button>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" variant="outline">
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Are you sure you want to delete the instructor?</DialogTitle>
                                                            <DialogDescription>
                                                                This action cannot be undone.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="flex gap-2 pt-4">
                                                            <Button
                                                                variant="destructive"
                                                                onClick={async () => {
                                                                    await handleDelete(inst.id);
                                                                }}
                                                            >
                                                                Delete
                                                            </Button>
                                                            <DialogTrigger asChild>
                                                                <Button variant="outline">Cancel</Button>
                                                            </DialogTrigger>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminInstructors;
