import { useState, useEffect } from 'react';
import { Search, Filter, ArrowRight, Car, Award, TrendingUp, Monitor, CheckCircle, Star, Users, Clock, PlayCircle, Shield, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { CourseCard } from '@/components/course/CourseCard';
import { useCourses } from '@/hooks/useCourses';
import { useRegions } from '@/hooks/useRegions';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';



const heroImages = [
 "/hero/slide1.jpg",
  "/hero/slide2.jpg",
];

const CanadianDrivingSchool = () => {
  // All hooks must be inside the component function
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const { courses, loading, error } = useCourses(1, 8); // Fetch 8 courses for the homepage
  const { regions, loading: regionsLoading, error: regionsError } = useRegions();
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Driving course categories
  const categories = [
    "Beginner Driver Education", 
    "Advanced Driving Skills", 
    "Defensive Driving",
    "Winter Driving", 
    "Commercial License (CDL)",
    "Motorcycle Training",
    "Driving Test Preparation",
    "Refresher Courses"
  ];

  // Combine fetched courses and dummy courses for display
  const allCourses = [...(courses || [])];

  // Filter and search courses from backend
  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course?.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course?.category === selectedCategory;
    const matchesRegion = selectedRegion === 'all' || String(course?.region_id) === String(selectedRegion);
    return matchesSearch && matchesCategory && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-white text-foreground transition-colors">
      <RoleBasedNavigation />
      {/* Hero Section */}

      {/* Enhanced Hero Section */}
<section className="relative py-24 overflow-hidden">
  {/* Advanced gradient overlay system */}
  <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent z-[1]" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-[1]" />
  
  {/* Enhanced background carousel with better transitions */}
  <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
    {heroImages.map((img, idx) => (
      <div
        key={img}
        className={`
          absolute inset-0 w-full h-full transition-all duration-[2000ms] ease-out
          ${idx === currentHeroImage 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-105"
          }
        `}
      >
        <img
          src={img}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.7) contrast(1.1)' }}
          draggable={false}
        />
      </div>
    ))}
  </div>

  {/* Animated background elements */}
  <div className="absolute inset-0 z-[1]">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
  </div>

  {/* Main content container */}
  <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
    {/* Premium badge with glassmorphism */}
    <div className="text-center mb-8">
      <div className="inline-flex items-center px-6 py-3 rounded-full mb-8 bg-white/15 backdrop-blur-md border border-white/20 shadow-2xl hover:bg-white/20 transition-all duration-300">
        <Award className="w-5 h-5 text-yellow-400 mr-3 drop-shadow-lg" />
        <span className="font-bold text-white text-base tracking-wide">
          MTO Approved • 25+ Years Experience • 98% Pass Rate
        </span>
      </div>
      
      {/* Enhanced headline with better typography */}
      <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[0.9] tracking-tight">
        Learn to Drive with{' '}
        <span className="bg-gradient-to-r from-red-400 via-pink-500 to-red-600 bg-clip-text text-transparent drop-shadow-2xl">
          Canada's Best
        </span>
      </h1>
      
      {/* Refined description */}
      <p className="text-lg md:text-xl text-white/95 font-medium mb-12 max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
        Professional driving instruction across Newfoundland and Labrador. From learner's license (Level I) to full Class 5 license, 
        we'll get you road-ready with confidence and safety.
      </p>

      {/* Modern trust indicators */}
      <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
        <div className="flex items-center group">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 transition-transform">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="text-2xl font-black text-white">50,000+</div>
            <div className="text-white/80 font-medium text-sm">Drivers Trained</div>
          </div>
        </div>
        <div className="flex items-center group">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 transition-transform">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="text-2xl font-black text-white">100%</div>
            <div className="text-white/80 font-medium text-sm">MTO Certified</div>
          </div>
        </div>
        <div className="flex items-center group">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mr-3 shadow-lg group-hover:scale-110 transition-transform">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <div className="text-2xl font-black text-white">24/7</div>
            <div className="text-white/80 font-medium text-sm">Flexible Booking</div>
          </div>
        </div>
      </div>
    </div>

    {/* Premium search section with advanced glassmorphism */}
    <div className="max-w-5xl mx-auto mb-16">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-500">
        <h3 className="text-xl font-bold text-white text-center mb-6 tracking-wide">
          Find Your Perfect Driving Course
        </h3>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5 group-hover:text-white/80 transition-colors" />
              <input
                type="text"
                placeholder="Search courses (G1, G2, Winter Driving, etc.)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-red-500/50 focus:border-red-400 text-base text-white placeholder-white/60 hover:bg-white/25 transition-all duration-300"
              />
            </div>
          </div>
          
          <div className="lg:w-80">
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-5 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-red-500/50 focus:border-red-400 text-base text-white hover:bg-white/25 transition-all duration-300"
            >
              <option value="all" className="bg-gray-800 text-white">All Course Types</option>
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-800 text-white">{category}</option>
              ))}
            </select>
          </div>
          <div className="lg:w-80">
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className="w-full px-6 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-400 text-base text-white hover:bg-white/25 transition-all duration-300"
            >
              <option value="all" className="bg-gray-800 text-white">All Regions</option>
              {regions.map(region => (
                <option key={region.id} value={region.id} className="bg-gray-800 text-white">{region.region_name}</option>
              ))}
            </select>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-base rounded-2xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1">
            <Search className="w-5 h-5 mr-2 inline" />
            Search
          </button>
        </div>
      </div>
    </div>

    {/* Enhanced CTA section */}
    <div className="text-center">
      <p className="text-lg text-white/95 font-medium mb-6 max-w-2xl mx-auto">
        Book your driving lesson today! Choose from morning, afternoon, or evening slots.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/appointments">
          <button className="group relative bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg px-10 py-4 font-bold shadow-2xl hover:shadow-green-500/25 transition-all duration-300 rounded-2xl hover:scale-105 hover:-translate-y-2">
            <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Calendar className="mr-3 h-6 w-6 inline relative z-10" />
            <span className="relative z-10">Book Driving Lesson</span>
          </button>
        </Link>
        <button className="group relative bg-white/15 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/25 text-lg px-10 py-4 font-bold rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <PlayCircle className="mr-3 h-6 w-6 inline relative z-10" />
          <span className="relative z-10">Watch Demo Video</span>
        </button>
      </div>
    </div>
  </div>

  {/* Scroll indicator */}
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
    <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
      <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce" />
    </div>
  </div>
</section>

      
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-[#181830] dark:to-[#23235b] transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">50,000+</div>
              <div className="text-red-100 font-medium">Students Trained</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
              <div className="text-red-100 font-medium">Pass Rate</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">25+</div>
              <div className="text-red-100 font-medium">Years Experience</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">15+</div>
              <div className="text-red-100 font-medium">Certified Instructors</div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Enhanced Statistics Section */}
<section className="relative py-12 bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 overflow-hidden">
  {/* Background decoration */}
  <div className="absolute inset-0 opacity-30">
    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-800 rounded-full blur-3xl opacity-20" />
    <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200 dark:bg-purple-800 rounded-full blur-3xl opacity-20" />
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-200 dark:bg-red-800 rounded-full blur-3xl opacity-15" />
  </div>

  {/* Animated grid pattern */}
  <div className="absolute inset-0 opacity-5 dark:opacity-10">
    <div className="w-full h-full" style={{
      backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
      backgroundSize: '40px 40px'
    }} />
  </div>

  <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    {/* Section header */}
    <div className="text-center mb-10">
      <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-4 backdrop-blur-sm border border-blue-200 dark:border-blue-700">
        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 6L18.29 8.29L13.41 13.17L9.41 9.17L2 16.59L3.41 18L9.41 12L13.41 16L20.71 8.71L23 11V6H16Z" />
        </svg>
        Our Achievements
      </div>
      <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3 leading-tight">
        Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">Thousands</span>
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
        Join the ranks of successful drivers who chose excellence
      </p>
    </div>

    {/* Statistics grid */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      
      {/* Passing Students */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 dark:from-blue-600/30 dark:to-cyan-600/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/25 dark:hover:shadow-blue-400/25 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-white/20 dark:border-gray-700/50">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
              87,654
            </div>
            <div className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-wide">
              Passing Students
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Success stories
            </div>
          </div>
        </div>
      </div>

      {/* Present Students */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 dark:from-green-600/30 dark:to-emerald-600/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl hover:shadow-green-500/25 dark:hover:shadow-green-400/25 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-white/20 dark:border-gray-700/50">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4C16.88 4 17.67 4.25 18.31 4.69C17.5 5.26 17 6.09 17 7C17 8.66 18.34 10 20 10C20.34 10 20.67 9.95 21 9.84V10C21 10.55 20.55 11 20 11H16V13C16 13.55 15.55 14 15 14H9C8.45 14 8 13.55 8 13V11H4C3.45 11 3 10.55 3 10V4C3 3.45 3.45 3 4 3H15C15.55 3 16 3.45 16 4M20 5.5C19.45 5.5 19 5.95 19 6.5S19.45 7.5 20 7.5 21 7.05 21 6.5 20.55 5.5 20 5.5M5 16H19V18H5V16M5 20H19V22H5V20Z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
              1,543
            </div>
            <div className="text-green-600 dark:text-green-400 font-bold text-sm tracking-wide">
              Active Students
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Currently learning
            </div>
          </div>
        </div>
      </div>

      {/* All Instructors */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-600/30 dark:to-pink-600/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl hover:shadow-purple-500/25 dark:hover:shadow-purple-400/25 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-white/20 dark:border-gray-700/50">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2A3 3 0 0 1 15 5A3 3 0 0 1 12 8A3 3 0 0 1 9 5A3 3 0 0 1 12 2M21 9V7H15L13.5 7.5C13.1 7.4 12.6 7.5 12 7.5S10.9 7.4 10.5 7.5L9 7H3V9H9L10.5 9.5C10.9 9.6 11.4 9.5 12 9.5S13.1 9.6 13.5 9.5L15 9H21M21 10H15L13.5 10.5C13.1 10.4 12.6 10.5 12 10.5S10.9 10.4 10.5 10.5L9 10H3V12H9L10.5 12.5C10.9 12.6 11.4 12.5 12 12.5S13.1 12.6 13.5 12.5L15 12H21V10Z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
              45+
            </div>
            <div className="text-purple-600 dark:text-purple-400 font-bold text-sm tracking-wide">
              Expert Instructors
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Certified professionals
            </div>
          </div>
        </div>
      </div>

      {/* Our Branches */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 dark:from-orange-600/30 dark:to-red-600/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl hover:shadow-orange-500/25 dark:hover:shadow-orange-400/25 transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-white/20 dark:border-gray-700/50">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C15.31 2 18 4.66 18 7.95C18 12.41 12 19 12 19S6 12.41 6 7.95C6 4.66 8.69 2 12 2M12 6C10.9 6 10 6.9 10 8S10.9 10 12 10 14 9.1 14 8 13.1 6 12 6M20 19C20 21.21 16.42 23 12 23S4 21.21 4 19C4 17.71 5.22 16.56 7.11 15.94L7.75 16.9C6.67 17.19 6 17.81 6 18.5C6 19.88 8.69 21 12 21S18 19.88 18 18.5C18 17.81 17.33 17.19 16.25 16.9L16.89 15.94C18.78 16.56 20 17.71 20 19Z" />
              </svg>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-black text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
              25+
            </div>
            <div className="text-orange-600 dark:text-orange-400 font-bold text-sm tracking-wide">
              Locations
            </div>
            <div className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              Across provinces
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom CTA */}
    <div className="text-center mt-10">
      <Link to="/courses">
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2M21 9V7L15 4V6L13.5 7L15 8V10L21 9M3 9L9 10V8L10.5 7L9 6V4L3 7V9M12 7.5C12.8 7.5 13.5 8.2 13.5 9S12.8 10.5 12 10.5 10.5 9.8 10.5 9 11.2 7.5 12 7.5M12 12C14.21 12 16 13.79 16 16V20H8V16C8 13.79 9.79 12 12 12Z" />
          </svg>
          Join Our Success Story
        </div>
      </Link>
    </div>
  </div>
</section>

      {/* Featured Courses Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background dark:bg-[#181830] transition-colors" id="courses">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 mb-4 dark:bg-blue-900/30 dark:text-blue-200">
              <Car className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Our Driving Programs</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Professional Driving Courses
            </h2>
            {/* <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From beginner to advanced, our MTO-approved courses are designed to make you a safe, 
              confident driver on Canadian roads.
            </p> */}
          </div>

          {loading ? (
            <div className="text-center py-16 bg-card dark:bg-[#23235b] rounded-lg">Loading...</div>
          ) : error ? (
            <div className="text-center py-16 bg-card dark:bg-[#23235b] rounded-lg text-red-600">{error}</div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
          <div className="text-center">
            <Link to="/courses">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-blue-500 text-blue-600 dark:text-blue-300 dark:border-blue-300 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white font-semibold px-8 py-6 text-lg"
              >
                <Car className="mr-2 h-5 w-5 inline" />
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      
{/* Why Choose Us Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-background dark:bg-[#181830] transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Why Choose DriveCanada Pro?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              As NL's premier driving school, we combine professional instruction with modern teaching methods 
              to ensure your success on the road.
            </p>
          </div>

          {/* Mobile: 2 cards per row, Tablet: 2 cards, Desktop: 3 cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {[
              {
                icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-red-600" />,
                title: "MTO Certified Instructors",
                description: "All our instructors are Ministry of Transportation certified with years of professional teaching experience."
              },
              {
                icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-green-600" />,
                title: "Modern Safety Features",
                description: "Our training vehicles are equipped with dual controls and latest safety technology for secure learning."
              },
              {
                icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-600" />,
                title: "Flexible Scheduling",
                description: "Book lessons at your convenience with morning, afternoon, evening, and weekend availability."
              },
              {
                icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-purple-600" />,
                title: "Personalized Training",
                description: "One-on-one instruction tailored to your learning pace and driving goals."
              },
              {
                icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-orange-600" />,
                title: "High Pass Rate",
                description: "98% of our students pass their driving test on the first attempt with our proven methods."
              },
              {
                icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-indigo-600" />,
                title: "Multiple Locations",
                description: "Convenient pickup locations across the GTA with door-to-door service available."
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-card dark:bg-[#23235b] text-card-foreground">
                <CardContent className="p-3 sm:p-4 lg:p-8">
                  <div className="flex justify-center mb-3 sm:mb-4 lg:mb-6">
                    <div className="p-2 sm:p-2.5 lg:p-3 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#23235b] dark:to-[#181830] rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base lg:text-xl font-bold text-foreground dark:text-white mb-2 sm:mb-3 lg:mb-4 leading-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed hidden sm:block">
                    {feature.description}
                  </p>
                  {/* Shortened description for mobile */}
                  <p className="text-xs text-muted-foreground leading-relaxed sm:hidden">
                    {feature.description.split('.')[0]}.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white" id="contact">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Start Driving?
            </h2>
            <p className="text-sm sm:text-base lg:text-xl text-gray-300 max-w-3xl mx-auto px-2">
              Contact us today to book your first lesson or get more information about our programs.
            </p>
          </div>

          {/* Mobile: Stack vertically, Tablet+: 3 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Call Us</h3>
              <a 
                href="tel:+17093516738" 
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors duration-200"
              >
                <span className="text-sm sm:text-base">+1 (709) 351-6738</span>
                <Phone className="w-3 h-3 text-gray-400" />
              </a>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Email Us</h3>
              <a 
                href="mailto:info@nldriversacademy.ca" 
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors duration-200"
              >
                <span className="text-sm sm:text-base break-all sm:break-normal">info@nldriversacademy.ca</span>
                <Mail className="w-3 h-3 text-gray-400" />
              </a>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">Visit Us</h3>
              <a 
                href="https://maps.google.com/?q=411+Torbay+Rd,+St.+John's,+NL+A1A+5C9" 
                target="_blank"
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors duration-200"
              >
                <span className="text-sm sm:text-base">411 Torbay Rd, St. John's, NL</span>
                <MapPin className="w-3 h-3 text-gray-400" />
              </a>
            </div>
          </div>

          <div className="text-center">
            <Link to="/appointments">
              <button className="bg-red-600 hover:bg-red-700 text-white text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-12 py-3 sm:py-3.5 lg:py-4 font-bold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
                <Calendar className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 inline" />
                <span className="text-sm sm:text-base lg:text-xl">Book Your First Lesson Today</span>
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default CanadianDrivingSchool;