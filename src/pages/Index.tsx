import { useState } from 'react';
import { Search, Filter, ArrowRight, Car, Award, TrendingUp, Monitor, CheckCircle, Star, Users, Clock, PlayCircle, Shield, MapPin, Phone, Mail, Calendar } from 'lucide-react';
import { CourseCard } from '@/components/course/CourseCard';
import { useCourses } from '@/hooks/useCourses';
import PublicHeader from '@/components/PublicHeader';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import RoleBasedNavigation from '@/components/navigation/RoleBasedNavigation';

// Dummy course data using your provided images and structure
/*const dummyCourses = [
  {
    id: 1,
    title: "G1 to G2 License Program",
    description: "Complete beginner driving course including classroom theory and in-car training. MTO approved curriculum.",
    category: "Beginner Driver Education",
    price: 599,
    duration: 40, // hours as number
    rating: 4.9,
    thumbnail_photo_path: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=250&fit=crop",
    course_reviews: Array(245)
  },
  {
    id: 2,
    title: "G2 to G License Program",
    description: "Advanced highway driving skills and G license test preparation with experienced certified instructors.",
    category: "Advanced Driving Skills",
    price: 399,
    duration: 20,
    rating: 4.8,
    thumbnail_photo_path: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop",
    course_reviews: Array(189)
  },
  {
    id: 3,
    title: "Winter Driving Mastery",
    description: "Essential Canadian winter driving techniques. Learn to handle snow, ice, and challenging weather conditions.",
    category: "Winter Driving",
    price: 299,
    duration: 12,
    rating: 4.9,
    thumbnail_photo_path: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
    course_reviews: Array(156)
  },
  {
    id: 4,
    title: "Defensive Driving Course",
    description: "Advanced safety techniques and hazard perception. Insurance discount eligible course.",
    category: "Defensive Driving",
    price: 249,
    duration: 8,
    rating: 4.7,
    thumbnail_photo_path: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop",
    course_reviews: Array(203)
  }
];*/

const CanadianDrivingSchool = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { courses, loading, error } = useCourses(1, 8); // Fetch 8 courses for the homepage

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
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <RoleBasedNavigation />
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#1e3a8a_25%,transparent_25%),linear-gradient(-45deg,#1e3a8a_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1e3a8a_75%),linear-gradient(-45deg,transparent_75%,#1e3a8a_75%)] bg-[size:60px_60px] bg-[position:0_0,0_30px,30px_-30px,-30px_0px] opacity-10"></div>
        
        {/* Animated Driving Images */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Car 1 - Floating Animation */}
          <div className="absolute top-20 left-10 w-20 h-20 animate-bounce opacity-30">
            <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Car className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          
          {/* Steering Wheel - Rotating */}
          <div className="absolute top-32 right-16 w-24 h-24 animate-spin opacity-25" style={{animationDuration: '15s'}}>
            <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
              <div className="w-16 h-16 border-4 border-white/50 rounded-full flex items-center justify-center">
                <div className="w-2 h-8 bg-white/60 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Traffic Light - Blinking */}
          <div className="absolute bottom-32 left-20 w-16 h-24 opacity-35">
            <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center space-y-1 border border-white/30">
              <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
          
          {/* Road Lines - Moving */}
          <div className="absolute bottom-20 right-24 w-32 h-20 opacity-30">
            <div className="w-full h-full bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden border border-white/20">
              <div className="flex space-x-2 animate-pulse">
                <div className="w-1 h-12 bg-white/60 rounded animate-bounce"></div>
                <div className="w-1 h-12 bg-white/60 rounded animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1 h-12 bg-white/60 rounded animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>

          {/* Additional Floating Elements */}
          <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-white/20 rounded-full animate-ping opacity-20"></div>
          <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-white/15 rounded-full animate-pulse opacity-25"></div>
          <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-white/25 rounded-full animate-bounce opacity-30"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <Award className="w-5 h-5 text-white mr-3" />
              <span className="text-white font-semibold">MTO Approved • 25+ Years Experience • 98% Pass Rate</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Learn to Drive with{' '}
              <span className="text-red-400">
                Canada's Best
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
              Professional driving instruction across Newfoundland and Labrador. From learner's license (Level I) to full Class 5 license, 
              we'll get you road-ready with confidence and safety.
            </p>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12 text-white/90">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="font-medium">50,000+ Drivers Trained</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="font-medium">MTO Certified Instructors</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <span className="font-medium">Flexible Scheduling</span>
              </div>
            </div>
          </div>

          {/* Search and Booking Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-card dark:bg-[#23235b] text-foreground backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20">
              <h3 className="text-xl font-bold text-foreground dark:text-white text-center mb-6">Find Your Perfect Driving Course</h3>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                    <input
                      type="text"
                      placeholder="Search courses (G1, G2, Winter Driving, etc.)"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
                    />
                  </div>
                </div>
                
                <div className="lg:w-72">
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-4 border border-gray-200  dark:bg-[#23235b] rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg bg-white"
                  >
                    <option value="all">All Course Types</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <button className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg rounded-xl shadow-lg transition-colors">
                  <Search className="w-5 h-5 mr-2 inline" />
                  Search Courses
                </button>
              </div>
            </div>
          </div>



          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="text-center mb-4">
              <p className="text-lg text-white/90 font-medium mb-4">
                Book your driving lesson today! Choose from morning, afternoon, or evening slots.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/appointments">
                  <button className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 font-semibold shadow-lg hover:shadow-xl transition-all rounded-xl">
                    <Calendar className="mr-2 h-5 w-5 inline" />
                    Book Driving Lesson
                  </button>
                </Link>
                <button className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 text-lg px-8 py-4 font-semibold rounded-xl transition-all">
                  <PlayCircle className="mr-2 h-5 w-5 inline" />
                  Watch Demo Video
                </button>
              </div>
            </div>
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

       <section className="py-10 px-4 sm:px-4 lg:px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {/* Passing Students */}
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9L12 3M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
              </svg>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">87654</div>
            <div className="text-blue-400 font-medium">Passing Students</div>
          </div>

          {/* Present Students */}
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 4C16.88 4 17.67 4.25 18.31 4.69C17.5 5.26 17 6.09 17 7C17 8.66 18.34 10 20 10C20.34 10 20.67 9.95 21 9.84V10C21 10.55 20.55 11 20 11H16V13C16 13.55 15.55 14 15 14H9C8.45 14 8 13.55 8 13V11H4C3.45 11 3 10.55 3 10V4C3 3.45 3.45 3 4 3H15C15.55 3 16 3.45 16 4M20 5.5C19.45 5.5 19 5.95 19 6.5S19.45 7.5 20 7.5 21 7.05 21 6.5 20.55 5.5 20 5.5M5 16H19V18H5V16M5 20H19V22H5V20Z" />
              </svg>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">543</div>
            <div className="text-blue-400 font-medium">Present Students</div>
          </div>

          {/* All Instructors */}
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2A3 3 0 0 1 15 5A3 3 0 0 1 12 8A3 3 0 0 1 9 5A3 3 0 0 1 12 2M21 9V7H15L13.5 7.5C13.1 7.4 12.6 7.5 12 7.5S10.9 7.4 10.5 7.5L9 7H3V9H9L10.5 9.5C10.9 9.6 11.4 9.5 12 9.5S13.1 9.6 13.5 9.5L15 9H21M21 10H15L13.5 10.5C13.1 10.4 12.6 10.5 12 10.5S10.9 10.4 10.5 10.5L9 10H3V12H9L10.5 12.5C10.9 12.6 11.4 12.5 12 12.5S13.1 12.6 13.5 12.5L15 12H21V10Z" />
              </svg>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">30</div>
            <div className="text-blue-400 font-medium">All Instructors</div>
          </div>

          {/* Our Branch */}
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C15.31 2 18 4.66 18 7.95C18 12.41 12 19 12 19S6 12.41 6 7.95C6 4.66 8.69 2 12 2M12 6C10.9 6 10 6.9 10 8S10.9 10 12 10 14 9.1 14 8 13.1 6 12 6M20 19C20 21.21 16.42 23 12 23S4 21.21 4 19C4 17.71 5.22 16.56 7.11 15.94L7.75 16.9C6.67 17.19 6 17.81 6 18.5C6 19.88 8.69 21 12 21S18 19.88 18 18.5C18 17.81 17.33 17.19 16.25 16.9L16.89 15.94C18.78 16.56 20 17.71 20 19Z" />
              </svg>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">15</div>
            <div className="text-blue-400 font-medium">Our Branch</div>
          </div>
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
            <Button size="lg" variant="outline" className="border-2 border-blue-500 text-blue-600 dark:text-blue-300 dark:border-blue-300 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-700 dark:hover:text-white font-semibold px-8 py-6 text-lg">
              <Car className="mr-2 h-5 w-5 inline" />
              View All Courses
            </Button>
          </div>
        </div>
      </section>

      

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background dark:bg-[#181830] transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Why Choose DriveCanada Pro?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              As NL's premier driving school, we combine professional instruction with modern teaching methods 
              to ensure your success on the road.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="w-8 h-8 text-red-600" />,
                title: "MTO Certified Instructors",
                description: "All our instructors are Ministry of Transportation certified with years of professional teaching experience."
              },
              {
                icon: <Shield className="w-8 h-8 text-green-600" />,
                title: "Modern Safety Features",
                description: "Our training vehicles are equipped with dual controls and latest safety technology for secure learning."
              },
              {
                icon: <Clock className="w-8 h-8 text-blue-600" />,
                title: "Flexible Scheduling",
                description: "Book lessons at your convenience with morning, afternoon, evening, and weekend availability."
              },
              {
                icon: <Users className="w-8 h-8 text-purple-600" />,
                title: "Personalized Training",
                description: "One-on-one instruction tailored to your learning pace and driving goals."
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
                title: "High Pass Rate",
                description: "98% of our students pass their driving test on the first attempt with our proven methods."
              },
              {
                icon: <MapPin className="w-8 h-8 text-indigo-600" />,
                title: "Multiple Locations",
                description: "Convenient pickup locations across the GTA with door-to-door service available."
              }
            ].map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-card dark:bg-[#23235b] text-card-foreground">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <div className="p-3 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#23235b] dark:to-[#181830] rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground dark:text-white mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white" id="contact">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Driving?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Contact us today to book your first lesson or get more information about our programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-gray-300">(416) 555-DRIVE</p>
              <p className="text-gray-300">(416) 555-3748</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-gray-300">info@drivecanadapro.ca</p>
              <p className="text-gray-300">booking@drivecanadapro.ca</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p className="text-gray-300">123 Queen Street West</p>
              <p className="text-gray-300">Toronto, ON M5H 2M9</p>
            </div>
          </div>

          <div className="text-center">
            <button className="bg-red-600 hover:bg-red-700 text-white text-xl px-12 py-4 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
              <Calendar className="mr-3 h-6 w-6 inline" />
              Book Your First Lesson Today
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CanadianDrivingSchool;