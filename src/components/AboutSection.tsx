
import { BookOpen, Car, Award, Users, Clock, Monitor } from 'lucide-react';

const features = [
  {
    icon: <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Online Theory Courses",
    description: "Comprehensive online modules to learn driving theory at your own pace.",
  },
  {
    icon: <Car className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "In-Car Instruction",
    description: "Practical, hands-on driving lessons with our professional instructors.",
  },
  {
    icon: <Award className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Test Preparation",
    description: "Specialized packages to help you ace your driving test with confidence.",
  },
  {
    icon: <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Certified Instructors",
    description: "Learn from the best. Our instructors are experienced and fully certified.",
  },
  {
    icon: <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Flexible Scheduling",
    description: "Book lessons that fit your schedule with easy online management.",
  },
  {
    icon: <Monitor className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
    title: "Progress Tracking",
    description: "Monitor your learning journey and track your progress towards your license.",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">About Us</h2>
          <p className="mt-2 text-4xl font-bold text-foreground tracking-tight sm:text-5xl">
            Empowering Safer Drivers with Smarter Training
          </p>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            With over a decade of experience, we provide top-tier driving education through a blend of engaging online theory and hands-on, practical in-car training. Our certified instructors are dedicated to building your confidence and skills on the road.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50 mx-auto">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-base text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-24">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="relative h-80 lg:h-full">
              <img
                className="absolute inset-0 h-full w-full object-cover rounded-lg shadow-lg"
                src="https://images.unsplash.com/photo-1542025061919-7303037a3c3b?w=800&h=600&fit=crop"
                alt="A person driving a car with an instructor"
              />
            </div>
            <div className="mt-8 lg:mt-0">
               <blockquote className="p-6 border-l-4 border-blue-600 bg-muted/30 rounded-r-lg">
                  <p className="text-xl font-medium text-foreground italic leading-relaxed">
                    "Our mission is to create a generation of confident, responsible, and safe drivers. We believe in education that's not just about passing a test, but about mastering a life-long skill."
                  </p>
                  <footer className="mt-4">
                    <p className="text-base font-semibold text-foreground">The EduPlatform Team</p>
                  </footer>
                </blockquote>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
