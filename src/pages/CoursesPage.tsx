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
import { type Course } from '@/types/courses';
import { useCourses } from '@/hooks/useCourses';
import ReactPaginate from "react-paginate";

const CoursesPage = () => {
  const { user } = useUser();
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('popularity');
  const [searchTerm, setSearchTerm] = useState('');

  // Use the hook for paginated courses
  const { courses, loading, error, currentPage, setCurrentPage } = useCourses(1, 10);

  // Filtering and sorting
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    return courses
      .filter(course => filter === 'all' || course?.category === filter)
      .filter(course =>
        course?.title.toLowerCase().includes(searchTerm.toLowerCase())
        // If you want to filter by instructor, add instructor to your Course type and API
      );
  }, [courses, filter, searchTerm]);

  const sortedCourses = useMemo(() => {
    const sorted = [...filteredCourses];
    switch (sort) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'newest':
        // If you have createdAt in your API, use it; otherwise, skip
        return sorted;
      case 'popularity':
      default:
        return sorted;
    }
  }, [sort, filteredCourses]);

  // Pagination UI (if you have totalCourses from Redux, use it; otherwise, hide or hardcode pageCount)
  const pageCount = 1; // Replace with Math.ceil(totalCourses / 10) if available

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

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

          {loading ? (
            <div className="text-center py-16 bg-card rounded-lg">Loading...</div>
          ) : error ? (
            <div className="text-center py-16 bg-card rounded-lg text-red-600">{error}</div>
          ) : sortedCourses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {sortedCourses.map(course => <CourseCard key={course?.id} course={course} />)}
              </div>
              {/* Pagination */}
              <div className="mt-8">
                <ReactPaginate
                  previousLabel={"← Previous"}
                  nextLabel={"Next →"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={3}
                  onPageChange={handlePageClick}
                  containerClassName={"pagination flex justify-center mt-4"}
                  pageClassName={"mx-1"}
                  activeClassName={"font-bold text-blue-600"}
                  previousClassName={"mx-2"}
                  nextClassName={"mx-2"}
                  forcePage={currentPage - 1}
                />
              </div>
            </>
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
