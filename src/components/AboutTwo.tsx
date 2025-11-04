import React from 'react';
import { CheckCircle, Award, Users, BookOpen, Car, Shield, Star, Clock } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Link } from 'react-router-dom';

export default function AboutTwo() {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const programs = [
    {
      name: "DriveSafe NL",
      hours: "25 Hours Online",
      description: "A self-paced, comprehensive online course covering the full Newfoundland and Labrador Driver Education curriculum. Perfect for learners who prefer flexibility while mastering the theory of safe driving.",
      icon: "🟦",
      border: "border-blue-400",
      ring: "ring-blue-400",
      accentBg: isDarkMode ? "bg-blue-900" : "bg-blue-50",
      accentText: isDarkMode ? "text-blue-200" : "text-blue-700"
    },
    {
      name: "Gold Certificate Program",
      hours: "25 Hours Online + 10.5 Hours In-Car",
      description: "A blended course offering online convenience and practical in-car instruction. Includes road test preparation and early test eligibility (8 months after obtaining a Learner's Permit).",
      badge: "Government Accredited",
      icon: "🟨",
      border: "border-amber-400",
      ring: "ring-amber-400",
      accentBg: isDarkMode ? "bg-amber-900" : "bg-amber-50",
      accentText: isDarkMode ? "text-amber-200" : "text-amber-700"
    },
    {
      name: "Platinum Certificate Program",
      hours: "25 Hours Online + 15.5 Hours In-Car",
      description: "Our most complete and premium training package. Includes advanced in-car training, full road test readiness, and use of the academy's vehicle for your official test.",
      badge: "Government Accredited",
      featured: true,
      icon: "🟩",
      border: "border-emerald-400",
      ring: "ring-emerald-400",
      accentBg: isDarkMode ? "bg-emerald-900" : "bg-emerald-50",
      accentText: isDarkMode ? "text-emerald-100" : "text-emerald-700"
    }
  ];

  const philosophy = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Knowledge",
      description: "Understanding the rules, risks, and responsibilities of driving."
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Skill",
      description: "Developing confidence through hands-on, real-world training."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Attitude",
      description: "Practicing patience, awareness, and respect for all road users."
    }
  ];

  const benefits = [
    { icon: <Award className="w-6 h-6" />, text: "Government Accreditation – Recognized by the Province of Newfoundland and Labrador" },
    { icon: <Users className="w-6 h-6" />, text: "Certified Instructors – Experienced, patient, and professional educators" },
    { icon: <Clock className="w-6 h-6" />, text: "Flexible Learning – Learn anytime, anywhere with 24/7 online access" },
    { icon: <Car className="w-6 h-6" />, text: "Modern Vehicles – Safe, clean, and fully equipped for in-car lessons" },
    { icon: <Star className="w-6 h-6" />, text: "Proven Success – High pass rates and excellent student feedback" }
  ];

  // Logo blue, used for all borders (blue-400: #60a5fa)
  const logoBlue = 'border-blue-400';
  const lightBlueBg = isDarkMode ? 'bg-blue-900' : 'bg-blue-50';
  const lightBlueText = isDarkMode ? 'text-blue-200' : 'text-blue-600';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100'}`}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800' : 'bg-blue-50'} text-blue-900`}> {/* gentle blue bg */}
        <div className="absolute inset-0 bg-black opacity-10" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight text-blue-700 dark:text-blue-200">
              NL Driver's Academy
            </h1>
            <p className="text-xl sm:text-2xl font-light mb-4 text-blue-500 dark:text-blue-200">
              Building Confidence. Building Safer Roads.
            </p>
            <p className="text-lg text-blue-400 dark:text-blue-300">
              Across Newfoundland & Labrador
            </p>
          </div>
        </div>
        <div className={`absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t ${isDarkMode ? 'from-gray-900' : 'from-blue-50'} to-transparent`} />
      </div>

      {/* Who We Are Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 sm:p-12 border-t-4 border-blue-400`}>
          <h2 className={`text-3xl sm:text-4xl font-bold mb-6 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
            <Shield className="w-10 h-10 text-blue-400" />
            Who We Are
          </h2>
          <p className={`text-lg leading-relaxed mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            NL Driver's Academy is a <span className="font-semibold text-blue-400">Government Accredited</span> driving school dedicated to providing exceptional driver education throughout Newfoundland and Labrador. Our mission is simple — to equip every student with the skills, knowledge, and confidence needed to drive safely, responsibly, and independently for life.
          </p>
          <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}
          >
            Whether you're a new learner preparing for your first road test or a driver looking to refresh your skills, our courses combine professional instruction, interactive learning, and real-world driving experience to make sure you're always in control — on the road and behind the wheel.
          </p>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className={`${isDarkMode ? 'bg-gray-800' : lightBlueBg} py-16`}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
            Our Philosophy
          </h2>
          <p className={`text-xl text-center mb-12 max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-blue-600'}`}
          >
            At NL Driver's Academy, we believe safe driving begins with:
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {philosophy.map((item, index) => (
              <div key={index} className={`${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white bg-opacity-10 backdrop-blur-lg border-blue-200'} rounded-xl p-8 border border-blue-100 hover:bg-opacity-20 transition-all duration-300`}>
                <div className={`${lightBlueText} mb-4`}>{item.icon}</div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-200">{item.title}</h3>
                </div>
                <p className={isDarkMode ? 'text-gray-300' : 'text-blue-900'}>{item.description}</p>
              </div>
            ))}
          </div>
          <p className={`text-lg text-center mt-12 max-w-4xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-blue-700'}`}
          >
            Our approach blends online flexibility with in-car, one-on-one instruction, ensuring every student learns at their own pace while receiving personalized guidance from certified instructors.
          </p>
        </div>
      </div>

      {/* Programs Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-4 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>Our Programs</h2>
        <p className={`text-lg text-center mb-12 ${isDarkMode ? 'text-gray-300' : 'text-blue-700'}`}>
          Accredited, structured, and modern driver education programs designed for today's learners
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div
              key={index}
              className={[
                'group bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-t-4',
                program.border,
                'transition-all duration-300 ring-0 transform hover:shadow-2xl',
                // Use static class per program for ring and scale
                `hover:scale-105 hover:ring-2 focus-within:scale-105 focus-within:ring-2`,
                program.ring
              ].join(' ')}
            >
              {/* Title accent area */}
              <div className={`${program.accentBg} ${program.accentText} p-6`}>
                <div className="text-4xl mb-2">{program.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{program.name}</h3>
                {program.badge && (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${program.accentText} bg-opacity-30`}>
                    {program.badge}
                  </span>
                )}
              </div>
              <div className="p-6">
                <p className={`font-semibold mb-4 ${program.accentText}`}>{program.hours}</p>
                <p className={isDarkMode ? 'text-gray-100' : 'text-gray-900'}>{program.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-blue-50'} py-16`}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-12 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>Why Choose NL Driver's Academy?</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className={`${isDarkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start gap-4`}>
                <div className={`text-blue-400 flex-shrink-0 mt-1`}>{benefit.icon}</div>
                <p className={isDarkMode ? 'text-gray-300' : 'text-blue-700'}>{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commitment Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className={`${isDarkMode ? 'bg-gradient-to-r from-blue-900 to-gray-800' : 'bg-gradient-to-r from-blue-100 to-blue-300'} rounded-2xl shadow-2xl p-8 sm:p-12 text-blue-900 dark:text-blue-100`}>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Our Commitment</h2>
          <p className={`text-xl text-center mb-6 ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}
          >
            At NL Driver's Academy, <span className="font-bold">safety isn't just a subject — it's our promise.</span>
          </p>
          <p className={`text-lg text-center mb-4 ${isDarkMode ? 'text-blue-100' : 'text-blue-700'}`}
          >
            We're proud to train the next generation of drivers who understand not only how to drive but also why safe driving matters.
          </p>
          <p className={`text-lg text-center font-semibold ${isDarkMode ? 'text-blue-100' : 'text-blue-800'}`}
          >
            Our goal is to make Newfoundland and Labrador's roads safer — one confident driver at a time.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`${isDarkMode ? 'bg-gradient-to-r from-blue-900 to-blue-800' : 'bg-blue-100'} py-16`}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-100 mb-4">📍 Join Us Today</h2>
          <p className={`text-xl mb-8 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}
          >
            Start your journey toward confidence, safety, and independence on the road.
          </p>
          <p className={`text-lg mb-8 ${isDarkMode ? 'text-blue-200' : 'text-blue-900'}`}
          >
            Choose from our accredited programs and become part of a community dedicated to building <span className="font-bold">Safer Roads. Smarter Drivers.</span>
          </p>
          <Link to="/courses">
            <button className={`${isDarkMode ? 'bg-blue-800 text-blue-100 hover:bg-blue-700' : 'bg-white text-blue-700 hover:bg-blue-50'} px-8 py-4 rounded-full text-lg font-bold transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105`}>
              Explore Our Programs
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}