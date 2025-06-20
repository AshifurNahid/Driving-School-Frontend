import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import PublicHeader from '@/components/PublicHeader';
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { CourseCard } from '@/components/course/CourseCard';
import { type Course } from '@/types/course';

const allCoursesData = [
  {
    id: 'c1',
    title: "Complete Web Development Bootcamp",
    instructor: "Sarah Johnson",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
    price: 49.99,
    type: 'online',
    rating: 4.8,
    enrollments: 12500,
    createdAt: '2024-05-20T10:00:00Z',
  },
  {
    id: 'c2',
    title: "In-Car G2 Road Test Preparation",
    instructor: "David Lee",
    thumbnail: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=250&fit=crop",
    price: 150.00,
    type: 'physical',
    rating: 4.9,
    enrollments: 850,
    createdAt: '2024-05-15T12:00:00Z',
  },
  {
    id: 'c3',
    title: "JavaScript Fundamentals",
    instructor: "Michael Chen",
    thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop",
    price: 29.99,
    type: 'online',
    rating: 4.7,
    enrollments: 9800,
    createdAt: '2024-04-28T14:30:00Z',
  },
  {
    id: 'c4',
    title: "Advanced React Patterns",
    instructor: "John Doe",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
    price: 79.99,
    type: 'online',
    rating: 4.9,
    enrollments: 6500,
    createdAt: '2024-06-01T09:00:00Z',
  },
  {
    id: 'c5',
    title: "Defensive Driving Masterclass",
    instructor: "Maria Garcia",
    thumbnail: "https://images.unsplash.com/photo-1549399542-7e6949257094?w=400&h=250&fit=crop",
    price: 250.00,
    type: 'physical',
    rating: 5.0,
    enrollments: 450,
    createdAt: '2024-03-10T11:00:00Z',
  },
  {
    id: 'c6',
    title: "Python for Data Science",
    instructor: "Emily White",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    price: 59.99,
    type: 'online',
    rating: 4.8,
    enrollments: 15000,
    createdAt: '2024-05-25T18:00:00Z',
  },
];

const courses: Course[] = allCoursesData.map(course => ({
  ...course,
  category: course.type,
}));

const CoursesPage = () => {
  const { user } = useUser();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('popularity');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = useMemo(() => {
    return courses
      .filter(course => filter === 'all' || course.category === filter)
      .filter(course => course.title.toLowerCase().includes(searchTerm.toLowerCase()) || course.instructor.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [filter, searchTerm]);

  const sortedCourses = useMemo(() => {
    const sorted = [...filteredCourses];
    switch (sort) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        // @ts-ignore
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'popularity':
      default:
        return sorted.sort((a, b) => b.enrollments - a.enrollments);
    }
  }, [sort, filteredCourses]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {user ? <RoleBasedNavigation /> : <PublicHeader />}
      <main className="flex-grow py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">Browse Our Courses</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">Find the perfect course to start your journey on the road.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 p-4 bg-card rounded-lg border">
            <div className="relative w-full md:w-auto md:flex-grow max-w-sm">
                <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <ToggleGroup type="single" value={filter} onValueChange={(value) => value && setFilter(value)} className="w-full sm:w-auto">
                    <ToggleGroupItem value="all" aria-label="All courses">All</ToggleGroupItem>
                    <ToggleGroupItem value="online" aria-label="Online courses">Online</ToggleGroupItem>
                    <ToggleGroupItem value="physical" aria-label="Physical courses">In-Person</ToggleGroupItem>
                </ToggleGroup>
                
                <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>

          {sortedCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sortedCourses.map(course => <CourseCard key={course.id} course={course} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-lg">
                <h3 className="text-2xl font-semibold text-foreground">No Courses Found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CoursesPage;
