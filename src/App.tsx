
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { UserProvider } from "@/contexts/UserContext";
import { AppointmentProvider } from "@/contexts/AppointmentContext";
import Index from "./pages/Index";
import AboutPage from "./pages/About";
import ContactPage from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAppointments from "./pages/AdminAppointments";
import UploadCourse from "./pages/UploadCourse";
import CourseEdit from "./pages/CourseEdit";
import CourseDetail from "./pages/CourseDetail";
import CourseLearn from "./pages/CourseLearn";
import LearnerProfile from "./pages/LearnerProfile";
import LearnerCourses from "./pages/LearnerCourses";
import AppointmentManagement from "./pages/AppointmentManagement";
import NotFound from "./pages/NotFound";
import CoursesPage from "./pages/CoursesPage";
import AdminInstructors from "./pages/AdminInstructors";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="eduplatform-ui-theme">
      <UserProvider>
        <AppointmentProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/appointments" element={<AdminAppointments />} />
                <Route path="/admin/instructors" element={<AdminInstructors/>} />
                <Route path="/upload-course" element={<UploadCourse mode="add" />} />
                <Route path="/course/:id/edit" element={<UploadCourse mode="edit" />} />
                <Route path="/course/:id" element={<CourseDetail />} />
                <Route path="/course/:id/learn" element={<CourseLearn />} />
                <Route path="/learner/profile" element={<LearnerProfile />} />
                <Route path="/learner/courses" element={<LearnerCourses />} />
                <Route path="/appointments" element={<AppointmentManagement />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AppointmentProvider>
      </UserProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
