import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';

const contactFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string({ required_error: 'Please select a subject.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }).max(500),
});

const ContactSection = () => {
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      message: '',
    },
  });

  function onSubmit(data: z.infer<typeof contactFormSchema>) {
    toast.success('Message sent successfully!', {
      description: 'We\'ll get back to you within 24 hours.',
      duration: 4000,
    });
    form.reset();
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      primary: '+1 (709) 351-6738',
      secondary: 'Available Mon-Sat, 8AM-8PM',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      link: 'tel:+17093516738',
      isLink: true
    },
    {
      icon: Mail,
      title: 'Email Us',
      primary: 'fasttrackdta@gmail.com',
      secondary: 'We respond within 4 hours',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400',
      link: 'mailto:fasttrackdta@gmail.com',
      isLink: true
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      primary: '411 Torbay Rd, St. John\'s, NL',
      secondary: 'A1A 5C9 - Main Office',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400',
      link: 'https://maps.google.com/?q=411+Torbay+Rd,+St.+John\'s,+NL+A1A+5C9',
      isLink: true,
      isExternal: true
    },
  ];

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-100 via-slate-50 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <CheckCircle className="w-4 h-4" />
            Professional Driving Instruction
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Get In Touch
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to start your driving journey? Contact NL Drivers Academy for professional, 
            personalized driving instruction that gets results.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Contact Info Cards */}
          {contactInfo.map((info, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className={`inline-flex p-4 rounded-2xl ${info.bgColor} mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <info.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${info.iconColor}`} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3">
                  {info.title}
                </h3>
                {info.isLink ? (
                  <a 
                    href={info.link}
                    className="inline-flex items-center gap-1.5 text-sm sm:text-base font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200 mb-1"
                    target={info.isExternal ? "_blank" : undefined}
                    rel={info.isExternal ? "noopener noreferrer" : undefined}
                  >
                    {info.primary}
                    {info.icon === Phone && <Phone className="w-3 h-3" />}
                    {info.icon === Mail && <Mail className="w-3 h-3" />}
                    {info.icon === MapPin && <MapPin className="w-3 h-3" />}
                  </a>
                ) : (
                  <p className="text-sm sm:text-base font-semibold text-foreground mb-1">
                    {info.primary}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {info.secondary}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Form Description */}
          <div className="lg:col-span-2">
            <div className="h-full flex flex-col justify-center">
              <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 p-6 sm:p-8 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-lg">
                <h3 className="text-xl sm:text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4 mt-3 sm:mt-4">
                  Professional Driving Instruction
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                      Certified instructors with years of professional experience
                    </p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                      Personalized lesson plans tailored to your skill level
                    </p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                      Modern vehicles equipped with dual controls for safety
                    </p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300">
                      Flexible scheduling to fit your busy lifestyle
                    </p>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-blue-100 dark:border-blue-900/30">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Our student pass rate exceeds the provincial average by 27%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-2xl bg-white dark:bg-slate-800/50 backdrop-blur-sm">
              <CardContent className="p-6 sm:p-8 lg:p-10">
                <div className="mb-6 sm:mb-8">
                  <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Send us a Message</h4>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Complete the form below and we'll get back to you promptly.
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base font-medium">Full Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter your full name" 
                                className="h-11 sm:h-12 text-base" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base font-medium">Phone Number *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="(709) 123-4567" 
                                className="h-11 sm:h-12 text-base" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">Email Address *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email" 
                              placeholder="your.email@example.com" 
                              className="h-11 sm:h-12 text-base" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">Subject *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11 sm:h-12 text-base">
                                <SelectValue placeholder="What can we help you with?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="New Student Inquiry">New Student Inquiry</SelectItem>
                              <SelectItem value="Lesson Booking">Lesson Booking</SelectItem>
                              <SelectItem value="Course Information">Course Information</SelectItem>
                              <SelectItem value="Road Test Preparation">Road Test Preparation</SelectItem>
                              <SelectItem value="Pricing & Packages">Pricing & Packages</SelectItem>
                              <SelectItem value="Technical Support">Technical Support</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base font-medium">Message *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your driving goals, experience level, and any specific requirements..."
                              className="resize-none min-h-[120px] text-base"
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>

                    <p className="text-xs sm:text-sm text-muted-foreground text-center mt-4">
                      By submitting this form, you agree to our privacy policy. We'll never share your information.
                    </p>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;