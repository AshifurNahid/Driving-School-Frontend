import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, BookOpen, Award, TrendingUp, Monitor, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';
import { CourseCard } from '@/components/course/CourseCard';
import { type Course } from '@/types/course';
import UserAppointmentView from '@/components/appointments/UserAppointmentView';
import { useUser } from '@/contexts/UserContext';

const Index = () => {
  const { user, isLearner } = useUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const coursesData = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      description: "Learn HTML, CSS, JavaScript, React, Node.js and more",
      instructor: "Sarah Johnson",
      category: "Web Development",
      price: 99.99,
      rating: 4.8,
      students: 12500,
      duration: "42 hours",
      thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=180&fit=crop",
      featured: true
    },
    {
      id: 2,
      title: "Python for Data Science",
      description: "Master Python programming for data analysis and machine learning",
      instructor: "Dr. Michael Chen",
      category: "Data Science",
      price: 79.99,
      rating: 4.7,
      students: 8900,
      duration: "35 hours",
      thumbnail: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=180&fit=crop",
      featured: false
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      description: "Learn the principles of user experience and interface design",
      instructor: "Emma Rodriguez",
      category: "Design",
      price: 69.99,
      rating: 4.9,
      students: 6700,
      duration: "28 hours",
      thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=180&fit=crop",
      featured: true
    },
    {
      id: 4,
      title: "Digital Marketing Mastery",
      description: "Complete guide to social media marketing and SEO",
      instructor: "James Wilson",
      category: "Marketing",
      price: 89.99,
      rating: 4.6,
      students: 5400,
      duration: "32 hours",
      thumbnail: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=180&fit=crop",
      featured: false
    }
  ];

  const mappedCourses: Course[] = coursesData.map(c => ({
    ...c,
    enrollments: c.students,
  }));

  // Featured instructors data
  const featuredInstructors = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Web Development",
      students: 25000,
      courses: 8,
      rating: 4.9,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b550?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Michael Chen",
      specialty: "Data Science",
      students: 18000,
      courses: 6,
      rating: 4.8,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Emma Rodriguez",
      specialty: "UI/UX Design",
      students: 15000,
      courses: 5,
      rating: 4.9,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Software Developer",
      content: "EduPlatform transformed my career. The quality of courses and instructors is exceptional.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "Maria Garcia",
      role: "UX Designer",
      content: "I learned more in 3 months here than in years of self-study. Highly recommend!",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face",
      rating: 5
    },
    {
      name: "David Kim",
      role: "Data Analyst",
      content: "The practical approach and real-world projects made all the difference in my learning journey.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
      rating: 5
    }
  ];

  const categories = ["Web Development", "Data Science", "Design", "Marketing", "Business"];

  const filteredCourses = mappedCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (course.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto text-center relative">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
              Teach.{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Learn.
              </span>{' '}
              Grow.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
              Join thousands of learners and educators in our comprehensive online platform. 
              Master new skills with expert instructors from around the world.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-6 font-semibold shadow-lg hover:shadow-xl transition-all">
                <Link to="/upload-course">
                  Start Teaching
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 font-semibold border-2 hover:bg-muted/50">
                <Link to="#courses">
                  Browse Courses
                  <BookOpen className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">50K+</div>
                <div className="text-muted-foreground font-medium">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">1,200+</div>
                <div className="text-muted-foreground font-medium">Quality Courses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">150+</div>
                <div className="text-muted-foreground font-medium">Expert Instructors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">4.8/5</div>
                <div className="text-muted-foreground font-medium">Student Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Appointments Section - Only show for logged-in learners */}
      {user && isLearner && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <UserAppointmentView />
          </div>
        </section>
      )}

      {/* Search Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background" id="courses">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Find Your Perfect Course</h2>
            <p className="text-lg text-muted-foreground font-medium">Explore our comprehensive library of courses</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-lg p-6 mb-16 border border-border">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-border bg-background font-medium"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 border-border bg-background">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button className="h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Featured Courses</h3>
            <p className="text-lg text-muted-foreground font-medium">Handpicked courses by our expert team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Instructors */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">Meet Our Top Instructors</h3>
            <p className="text-lg text-muted-foreground font-medium">Learn from industry experts and thought leaders</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredInstructors.map((instructor, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-border bg-card">
                <CardContent className="pt-6">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={instructor.avatar} alt={instructor.name} />
                    <AvatarFallback>{instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <h4 className="text-xl font-semibold text-foreground mb-2">{instructor.name}</h4>
                  <p className="text-muted-foreground mb-4">{instructor.specialty}</p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{instructor.students.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Students</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{instructor.courses}</div>
                      <div className="text-sm text-muted-foreground">Courses</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{instructor.rating}</div>
                      <div className="text-sm text-muted-foreground">Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-foreground mb-4">What Our Students Say</h3>
            <p className="text-lg text-muted-foreground font-medium">Real success stories from our learning community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Stay Updated with Latest Courses
          </h3>
          <p className="text-lg text-blue-100 mb-8 font-medium">
            Subscribe to our newsletter and never miss out on new learning opportunities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70"
            />
            <Button className="bg-white text-blue-600 hover:bg-white/90 font-semibold">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">
            Ready to Start Your Teaching Journey?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 font-medium">
            Share your knowledge with thousands of students worldwide. 
            Create and upload your courses today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium">
              <Link to="/upload-course">Create Your Course</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-border hover:bg-muted/50 font-medium">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
