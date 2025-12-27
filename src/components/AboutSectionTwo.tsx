import { BookOpen, Car, Award, Users, Clock, Monitor, Phone, MessageCircle } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const AboutSectionTwo = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const achievements = [
    {
      icon: <Award className="h-6 w-6" />,
      title: "10 Years in Market",
      description: "Fast Track Drivers Academy is a trusted leader in the driving education industry with over 10 years of experience, delivering top-notch training to students of all backgrounds globally.",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "25+ Certified Instructors",
      description: "As a leading provider of driving education services, we are dedicated to delivering high-quality instruction for safe and confident driving.",
    },
    {
      icon: <Car className="h-6 w-6" />,
      title: "500+ Successful Students",
      description: "With over a decade of experience in the driving education market, Fast Track Drivers Academy is a trusted provider of comprehensive training solutions to students worldwide.",
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
            <h1 className={`text-3xl md:text-4xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              NL Driver’s Academy
            </h1>
            <p className={`text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Driving Confidence. Building Safer Roads Across Newfoundland & Labrador.
            </p>
          </div>

          {/* Who We Are & Philosophy */}
          <div className="mb-12 grid lg:grid-cols-2 gap-12 items-start">
            <div className="px-1 md:px-2">
              <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Who We Are</h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4 text-justify`}>
                NL Driver’s Academy is a Government Accredited driving school dedicated to providing exceptional driver education throughout Newfoundland and Labrador.
              </p>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4 text-justify`}>
                Our mission is simple — to equip every student with the skills, knowledge, and confidence needed to drive safely, responsibly, and independently for life.
              </p>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-justify`}>
                Whether you’re a new learner preparing for your first road test or a driver looking to refresh your skills, our courses combine professional instruction, interactive learning, and real-world driving experience to make sure you’re always in control — on the road and behind the wheel.
              </p>
            </div>
            <div className="px-1 md:px-2">
              <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Our Philosophy</h2>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
                At NL Driver’s Academy, we believe safe driving begins with:
              </p>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li className="flex gap-2"><span>✅</span><span><b>Knowledge</b> – Understanding the rules, risks, and responsibilities of driving.</span></li>
                <li className="flex gap-2"><span>✅</span><span><b>Skill</b> – Developing confidence through hands-on, real-world training.</span></li>
                <li className="flex gap-2"><span>✅</span><span><b>Attitude</b> – Practicing patience, awareness, and respect for all road users.</span></li>
              </ul>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mt-4 text-justify`}>
                Our approach blends online flexibility with in-car, one-on-one instruction, ensuring every student learns at their own pace while receiving personalized guidance from certified instructors.
              </p>
            </div>
          </div>

          {/* Programs */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Our Programs</h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
              We offer accredited, structured, and modern driver education programs designed for today’s learners:
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-5`}>
                <div className="text-2xl mb-2">🟦</div>
                <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>DriveSafe NL – Certified Online Driver Education (25 Hours)</h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
                  A self-paced, comprehensive online course covering the full Newfoundland and Labrador Driver Education curriculum. Perfect for learners who prefer flexibility while mastering the theory of safe driving.
                </p>
              </div>
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-5`}>
                <div className="text-2xl mb-2">🟨</div>
                <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Gold Certificate Program – Government Accredited (25 Hours Online + 10.5 Hours In-Car)</h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
                  A blended course offering online convenience and practical in-car instruction. Includes road test preparation and early test eligibility (8 months after obtaining a Learner’s Permit).
                </p>
              </div>
              <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg p-5`}>
                <div className="text-2xl mb-2">🟩</div>
                <h3 className={`font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Platinum Certificate Program – Government Accredited (25 Hours Online + 15.5 Hours In-Car)</h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>
                  Our most complete and premium training package. Includes advanced in-car training, full road test readiness, and use of the academy’s vehicle for your official test.
                </p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Why Choose NL Driver’s Academy?</h2>
            <ul className={`grid md:grid-cols-2 gap-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="flex gap-2"><span>🌟</span><span>Government Accreditation – Recognized by the Province of Newfoundland and Labrador.</span></li>
              <li className="flex gap-2"><span>👨‍🏫</span><span>Certified Instructors – Experienced, patient, and professional educators.</span></li>
              <li className="flex gap-2"><span>💻</span><span>Flexible Learning – Learn anytime, anywhere with 24/7 online access.</span></li>
              <li className="flex gap-2"><span>🚗</span><span>Modern Vehicles – Safe, clean, and fully equipped for in-car lessons.</span></li>
              <li className="flex gap-2"><span>🏆</span><span>Proven Success – High pass rates and excellent student feedback.</span></li>
            </ul>
          </div>

          {/* Our Commitment */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Our Commitment</h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 text-justify`}>
              At NL Driver’s Academy, safety isn’t just a subject — it’s our promise. We’re proud to train the next generation of drivers who understand not only how to drive but also why safe driving matters.
            </p>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} text-justify`}>
              Our goal is to make Newfoundland and Labrador’s roads safer — one confident driver at a time.
            </p>
          </div>

          {/* CTA */}
          <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'} border rounded-lg p-6 mb-12`}>
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>📍 Join Us Today</h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3`}>
              Start your journey toward confidence, safety, and independence on the road.
            </p>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Choose from our accredited programs and become part of a community dedicated to building Safer Roads. Smarter Drivers.
            </p>
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
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSectionTwo;


