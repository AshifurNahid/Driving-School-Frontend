import { BookOpen, Car, Award, Users, Clock, Monitor, Phone, MessageCircle } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const AboutSection = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Online Theory Courses",
      description: "Comprehensive online modules to learn driving theory at your own pace with interactive content and real-time assessments.",
    },
    {
      icon: <Car className="h-6 w-6" />,
      title: "In-Car Instruction",
      description: "Practical, hands-on driving lessons with our professional instructors using modern vehicles and safety equipment.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Test Preparation",
      description: "Specialized packages and mock tests to help you ace your driving test with confidence and thorough preparation.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Certified Instructors",
      description: "Learn from experienced and fully certified professionals dedicated to your success and road safety.",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Flexible Scheduling",
      description: "Book lessons that fit your schedule with our intelligent booking system and easy online management platform.",
    },
    {
      icon: <Monitor className="h-6 w-6" />,
      title: "Progress Tracking",
      description: "Advanced analytics to monitor your learning journey and track progress with detailed performance insights.",
    },
  ];

  const stats = [
    {
      icon: <Users className="h-8 w-8" />,
      number: "10+",
      label: "Years Of Experience In Delivering Driving Education",
    },
    {
      icon: <Car className="h-8 w-8" />,
      number: "500+",
      label: "Students Successfully Trained",
    },
    {
      icon: <Award className="h-8 w-8" />,
      number: "95+",
      label: "Pass Rate Achievement",
    },
    {
      icon: <Monitor className="h-8 w-8" />,
      number: "25+",
      label: "Certified Professional Instructors",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      number: "1000+",
      label: "Successful Driving Tests Completed",
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      number: "100%",
      label: "Comprehensive Learning Solutions",
    },
  ];

  const achievements = [
    {
      icon: <Award className="h-6 w-6" />,
      title: "10 Years in Market",
      description: "EduPlatform is a trusted leader in the driving education industry with over 10 years of experience, delivering top-notch training to students of all backgrounds globally.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "25+ Certified Instructors",
      description: "As a leading provider of driving education services, we are dedicated to delivering high-quality instruction for safe and confident driving.",
    },
    {
      icon: <Car className="h-6 w-6" />,
      title: "500+ Successful Students",
      description: "With over a decade of experience in the driving education market, EduPlatform is a trusted provider of comprehensive training solutions to students worldwide.",
    },
    {
      icon: <Monitor className="h-6 w-6" />,
      title: "100% Learning Solutions",
      description: "Empowering your vision with 100% comprehensive learning solutions—where innovation meets excellence in driving education.",
    },
  ];

  const HexagonIcon = ({ children, className = "" }) => (
    <div className={`relative ${className}`}>
      <div className={`w-16 h-16 ${isDarkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'} border-2 rotate-45 rounded-lg flex items-center justify-center`}>
        <div className="-rotate-45 text-red-500">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-16">
            <div className="flex items-center mb-4">
              
            </div>
            <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              We deliver the best & we are unbeatable.
            </h1>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="px-4 md:px-6">
                <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-justify`}>
                  EduPlatform is a renowned driving education and training company that helps students, 
                  beginners, and experienced drivers accelerate their road skills. Our team comprises more than 25 highly 
                  motivated professionals proficient in the latest teaching methods and constantly improving their 
                  skills.
                </p>
                <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-justify`}>
                  Our expertise and experience allow us to ensure high quality at every stage of the 
                  driver education lifecycle, from theory learning and requirements assessment to 
                  practical training, test preparation, and post-license guidance. We specialize in 
                  serving various student needs globally, including Beginner Drivers, Advanced Training, Test Preparation, 
                  Defensive Driving, Fleet Training, Motorcycle Training, Commercial Licenses, 
                  and various On-Demand Solutions.
                </p>
                
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6 px-4 md:px-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`p-3 rounded-lg border ${
                        index % 3 === 0 
                          ? (isDarkMode ? 'bg-blue-500/10 border-blue-400/30 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600')
                          : index % 3 === 1 
                          ? (isDarkMode ? 'bg-red-500/10 border-red-400/30 text-red-400' : 'bg-red-50 border-red-200 text-red-500')
                          : (isDarkMode ? 'bg-purple-500/10 border-purple-400/30 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-600')
                      }`}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {stat.number}
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} px-2`}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-8 px-4 md:px-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <HexagonIcon>
                    {achievement.icon}
                  </HexagonIcon>
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {achievement.title}
                    </h3>
                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-justify`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side - Reviews/Testimonials */}
            <div className="relative px-4 md:px-6">
              {/* Reviews Badge */}
              <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm">Google Reviews</div>
                    <div className="flex items-center">
                      <span className="text-2xl font-bold mr-2">4.8</span>
                      <div className="flex text-yellow-300">
                        {'★★★★★'.split('').map((star, i) => (
                          <span key={i}>{star}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">REVIEWED ON</div>
                    <div className="text-lg font-bold">Clutch</div>
                    <div className="text-sm">4.9 RATING</div>
                  </div>
                </div>
              </div>

              {/* Image */}
              {/* <div className="relative rounded-lg overflow-hidden mb-4">
                <img
                  src="https://images.unsplash.com/photo-1542025061919-7303037a3c3b?w=600&h=400&fit=crop"
                  alt="Driving instruction"
                  className="w-full h-64 object-cover"
                />
              </div> */}

              {/* Chat Widget */}
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-4 shadow-lg`}>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>WhatsApp</span>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Instructor</div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Sarah Mitchell: Please share your availability for driving lessons. Thanks
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className={`border rounded-lg p-3 ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                  <input
                    type="text"
                    placeholder="Type a reply"
                    className={`w-full bg-transparent text-sm outline-none ${isDarkMode ? 'text-gray-300 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'}`}
                  />
                </div>
              </div>

              {/* WhatsApp Float */}
              {/* <div className="fixed bottom-6 left-6">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <Phone className="h-6 w-6 text-white" />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;