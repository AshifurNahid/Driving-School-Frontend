import { useState } from 'react';
import { Search, Filter, ArrowRight, BookOpen, Award, TrendingUp, Monitor, CheckCircle, Star, Users, Clock, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';
import { CourseCard } from '@/components/course/CourseCard';
import { useCourses } from '@/hooks/useCourses';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { courses, loading, error } = useCourses(1, 8); // Fetch 8 courses for the homepage

  // Professional course categories
  const categories = [
    "Web Development", 
    "Data Science", 
    "Mobile Development",
    "UI/UX Design", 
    "DevOps & Cloud",
    "Cybersecurity",
    "Machine Learning",
    "Digital Marketing"
  ];

  // Filter and search courses from backend
  const filteredCourses = (courses || []).filter(course => {
    const matchesSearch = course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course?.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background dark:bg-[#0a0a23] transition-colors">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-[#0a0a23] dark:via-[#1e1e3f] dark:to-[#23235b] overflow-hidden transition-colors">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 pointer-events-none"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8 dark:bg-blue-900/30 dark:border-blue-900/40">
              <Award className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-200 text-sm font-medium">Most Trusted Online Learning Platform</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white dark:text-white mb-6 tracking-tight">
              Master New Skills with{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Expert Instructors
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 dark:text-blue-200 mb-12 max-w-4xl mx-auto leading-relaxed">
              Join over 3 million learners worldwide. Access premium courses, get certified, 
              and advance your career with our comprehensive learning platform.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-blue-200">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>3M+ Drivers Trained</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>100% Satisfaction Guarantee</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span>24/7 Customer Support</span>
              </div>
            </div>
          </div>

          {/* Integrated Search Bar */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-white/10 dark:bg-[#181830]/80 backdrop-blur-lg rounded-2xl p-6 border border-white/20 dark:border-[#23235b]/40 shadow-2xl">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200 dark:text-blue-300 h-5 w-5" />
                    <Input
                      placeholder="Search for courses, skills, or instructors..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-14 bg-white/10 dark:bg-[#181830]/80 border-white/20 dark:border-[#23235b]/40 text-white placeholder:text-blue-200 dark:placeholder:text-blue-300 text-lg font-medium backdrop-blur-sm"
                    />
                  </div>
                </div>
                
                <div className="lg:w-64">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-14 bg-white/10 dark:bg-[#181830]/80 border-white/20 dark:border-[#23235b]/40 text-white dark:text-white backdrop-blur-sm">
                      <Filter className="h-4 w-4 mr-2 text-blue-200 dark:text-blue-300" />
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 dark:bg-[#23235b] border-slate-700 dark:border-[#23235b] text-white dark:text-white">
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="h-14 px-8 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold text-lg shadow-lg dark:from-blue-700 dark:to-cyan-700 dark:hover:from-blue-800 dark:hover:to-cyan-800">
                  <Search className="w-5 h-5 mr-2" />
                  Search Courses
                </Button>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {/* Description for appointment slots */}
            <div className="w-full text-center mb-4">
              <p className="text-lg text-white dark:text-blue-200 font-medium">
                Reserve your learning slot now! Choose a date and time for your session. Available slots are updated in real-time.
              </p>
            </div>
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-lg px-8 py-6 font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Link to="/appointments">
                Take a Slot
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {/* <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6 font-semibold border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
              <Link to="#courses">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </Button> */}
          </div>
        </div>
      </section>

      {/* User Appointments Section - Only show for logged-in learners */}
      {/*
      {user && isLearner && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="max-w-7xl mx-auto">
            <UserAppointmentView />
          </div>
        </section>
      )}
      */}

      {/* Featured Courses Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-[#181830] dark:to-[#23235b] transition-colors" id="courses">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 mb-4 dark:bg-blue-900/30 dark:text-blue-200">
              <BookOpen className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Featured Courses</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">
              Popular Courses This Month
            </h2>
            <p className="text-xl text-slate-600 dark:text-blue-200 max-w-3xl mx-auto">
              Discover our most popular courses, carefully selected by industry experts 
              and loved by thousands of students worldwide.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16 bg-card dark:bg-[#23235b] rounded-lg">Loading...</div>
          ) : error ? (
            <div className="text-center py-16 bg-card dark:bg-[#23235b] rounded-lg text-red-600">{error}</div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {filteredCourses.map((course) => (
                <CourseCard key={course?.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card dark:bg-[#23235b] rounded-lg">
              <h3 className="text-2xl font-semibold text-foreground dark:text-white">No Courses Found</h3>
              <p className="text-muted-foreground dark:text-blue-200 mt-2">Try adjusting your search or filters.</p>
            </div>
          )}

          {/* View All Courses Button */}
          <div className="text-center">
            <Button size="lg" variant="outline" className="border-2 border-blue-500 text-blue-600 dark:text-blue-300 dark:border-blue-300 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white font-semibold px-8 py-6 text-lg">
              <BookOpen className="mr-2 h-5 w-5" />
              View All Courses
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-[#181830] dark:to-[#23235b] transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent dark:from-blue-300 dark:to-cyan-300">
                3M+
              </div>
              <div className="text-slate-300 dark:text-blue-200 font-medium">Students Trained</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                100%
              </div>
              <div className="text-slate-300 font-medium">Satisfaction Rate</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                1,200+
              </div>
              <div className="text-slate-300 font-medium">Premium Courses</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                24/7
              </div>
              <div className="text-slate-300 font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#181830] transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-slate-600 dark:text-blue-200 max-w-3xl mx-auto">
              We're committed to providing the best online learning experience with cutting-edge technology and expert instruction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="w-8 h-8 text-blue-500" />,
                title: "Expert Instructors",
                description: "Learn from industry professionals with years of real-world experience and proven track records."
              },
              {
                icon: <Monitor className="w-8 h-8 text-green-500" />,
                title: "Interactive Learning",
                description: "Engage with hands-on projects, quizzes, and real-world applications to reinforce your learning."
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-purple-500" />,
                title: "Lifetime Access",
                description: "Once enrolled, access your courses anytime, anywhere, with no expiration date."
              },
              {
                icon: <Users className="w-8 h-8 text-orange-500" />,
                title: "Community Support",
                description: "Connect with fellow learners, share knowledge, and get help from our vibrant community."
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-cyan-500" />,
                title: "Career Growth",
                description: "Advance your career with in-demand skills and industry-recognized certifications."
              },
              {
                icon: <Star className="w-8 h-8 text-yellow-500" />,
                title: "Quality Guarantee",
                description: "100% satisfaction guarantee with our premium course content and learning experience."
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md dark:bg-[#23235b] dark:text-white">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-3 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#23235b] dark:to-[#181830] rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-blue-200 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;