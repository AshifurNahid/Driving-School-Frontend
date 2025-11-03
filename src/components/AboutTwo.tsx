import React from 'react';
import { CheckCircle, Award, Users, BookOpen, Car, Shield, Star, Clock } from 'lucide-react';

export default function AboutTwo() {
  const programs = [
    {
      name: "DriveSafe NL",
      color: "bg-blue-500",
      borderColor: "border-blue-500",
      hours: "25 Hours Online",
      description: "A self-paced, comprehensive online course covering the full Newfoundland and Labrador Driver Education curriculum. Perfect for learners who prefer flexibility while mastering the theory of safe driving.",
      icon: "🟦"
    },
    {
      name: "Gold Certificate Program",
      color: "bg-yellow-500",
      borderColor: "border-yellow-500",
      hours: "25 Hours Online + 10.5 Hours In-Car",
      description: "A blended course offering online convenience and practical in-car instruction. Includes road test preparation and early test eligibility (8 months after obtaining a Learner's Permit).",
      badge: "Government Accredited",
      icon: "🟨"
    },
    {
      name: "Platinum Certificate Program",
      color: "bg-green-500",
      borderColor: "border-green-500",
      hours: "25 Hours Online + 15.5 Hours In-Car",
      description: "Our most complete and premium training package. Includes advanced in-car training, full road test readiness, and use of the academy's vehicle for your official test.",
      badge: "Government Accredited",
      featured: true,
      icon: "🟩"
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 sm:py-28">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 tracking-tight">
              NL Driver's Academy
            </h1>
            <p className="text-xl sm:text-2xl font-light mb-4 text-blue-100">
              Building Confidence. Building Safer Roads.
            </p>
            <p className="text-lg text-blue-200">
              Across Newfoundland & Labrador
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      {/* Who We Are Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border-t-4 border-blue-600">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Shield className="w-10 h-10 text-blue-600" />
            Who We Are
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            NL Driver's Academy is a <span className="font-semibold text-blue-600">Government Accredited</span> driving school dedicated to providing exceptional driver education throughout Newfoundland and Labrador. Our mission is simple — to equip every student with the skills, knowledge, and confidence needed to drive safely, responsibly, and independently for life.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Whether you're a new learner preparing for your first road test or a driver looking to refresh your skills, our courses combine professional instruction, interactive learning, and real-world driving experience to make sure you're always in control — on the road and behind the wheel.
          </p>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
            Our Philosophy
          </h2>
          <p className="text-xl text-blue-100 text-center mb-12 max-w-3xl mx-auto">
            At NL Driver's Academy, we believe safe driving begins with:
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {philosophy.map((item, index) => (
              <div key={index} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300">
                <div className="text-blue-200 mb-4">{item.icon}</div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-6 h-6 text-green-300" />
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-blue-100">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="text-lg text-blue-100 text-center mt-12 max-w-4xl mx-auto">
            Our approach blends online flexibility with in-car, one-on-one instruction, ensuring every student learns at their own pace while receiving personalized guidance from certified instructors.
          </p>
        </div>
      </div>

      {/* Programs Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
          Our Programs
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12">
          Accredited, structured, and modern driver education programs designed for today's learners
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-lg overflow-hidden border-t-4 ${program.borderColor} hover:shadow-2xl transition-all duration-300 ${program.featured ? 'ring-2 ring-green-500 transform scale-105' : ''}`}
            >
              <div className={`${program.color} text-white p-6`}>
                <div className="text-4xl mb-2">{program.icon}</div>
                <h3 className="text-2xl font-bold mb-2">{program.name}</h3>
                {program.badge && (
                  <span className="inline-block bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm font-semibold">
                    {program.badge}
                  </span>
                )}
              </div>
              <div className="p-6">
                <p className="font-semibold text-gray-900 mb-4">{program.hours}</p>
                <p className="text-gray-700 leading-relaxed">{program.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
            Why Choose NL Driver's Academy?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300 flex items-start gap-4">
                <div className="text-blue-600 flex-shrink-0 mt-1">
                  {benefit.icon}
                </div>
                <p className="text-gray-700">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Commitment Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-2xl p-8 sm:p-12 text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
            Our Commitment
          </h2>
          <p className="text-xl text-center mb-6 text-blue-100">
            At NL Driver's Academy, <span className="font-bold">safety isn't just a subject — it's our promise.</span>
          </p>
          <p className="text-lg text-center text-blue-100 mb-4">
            We're proud to train the next generation of drivers who understand not only how to drive but also why safe driving matters.
          </p>
          <p className="text-lg text-center text-blue-100 font-semibold">
            Our goal is to make Newfoundland and Labrador's roads safer — one confident driver at a time.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            📍 Join Us Today
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Start your journey toward confidence, safety, and independence on the road.
          </p>
          <p className="text-lg text-green-100 mb-8">
            Choose from our accredited programs and become part of a community dedicated to building <span className="font-bold">Safer Roads. Smarter Drivers.</span>
          </p>
          <button className="bg-white text-green-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-green-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
            Explore Our Programs
          </button>
        </div>
      </div>
    </div>
  );
}