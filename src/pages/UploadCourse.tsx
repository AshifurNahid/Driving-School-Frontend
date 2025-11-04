import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Plus, Trash2, Eye, Play, ChevronDown, ChevronRight, BookOpen, Video, Brain, Car, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ThemeToggle } from '@/components/ThemeToggle';
import PhysicalCourseForm from '@/components/course/PhysicalCourseForm';
import { QuizModal } from '@/components/course/QuizModal';
import { MaterialModal } from '@/components/course/MaterialModal';
import { createAdminCourse, getAdminCourseDetails, updateAdminCourse, getAdminRegionList } from '@/redux/actions/adminAction';
import { toast } from '@/components/ui/use-toast';
import { RootState, AppDispatch } from '@/redux/store';

type CourseType = 'online' | 'physical' | 'hybrid';

interface Subsection {
  title: string;
  description?: string;
  duration?: number | string;
  videoUrl: string;
  pdfUrl?: string;
}

interface Question {
  id?: string;
  type: 'mcq' | 'true-false' | 'short-answer';
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
  explanation?: string;
  points: number;
}

interface Quiz {
  title: string;
  description: string;
  questions: Question[];
  passPercentage: number;
  timeLimit?: number;
  max_attempts: string;
}

interface ModuleMaterial {
  name: string;
  url: string;
}

interface Module {
  title: string;
  description: string;
  subsections: Subsection[];
  quiz?: Quiz;
  isExpanded: boolean;
  isQuizExpanded: boolean;
  materials?: ModuleMaterial[];
}

interface PhysicalCourseData {
  title: string;
  price: number;
  duration: string;
  includes: string;
  description: string;
  location: string;
}

interface CourseMaterial {
  name: string;
  url: string;
}

interface Course {
  id?: string;
  title: string;
  description: string;
  content: string;
  category: string;
  price: number;
  duration: number; // in hours - only for online courses
  level: string;
  language: string;
  prerequisites: string;
  thumbnail_photo_path: string;
  courseType: CourseType;
  modules: Module[];
  physicalCourseData?: PhysicalCourseData;
  materials: CourseMaterial[];
  region_id?: number | null; // only for offline and hybrid courses
  offline_training_hours?: number | null; // only for offline and hybrid courses
}

const steps = [
  { key: 'type', label: 'Course Type' },
  { key: 'info', label: 'Course Info' },
  { key: 'content', label: 'Content' },
  { key: 'preview', label: 'Preview & Publish' },
];

interface UploadCourseProps {
  initialCourse?: Course;
  mode?: 'add' | 'edit';
}

const defaultCourse: Course = {
  title: '',
  description: '',
  content: '',
  category: '',
  price: 0,
  duration: 0,
  level: '',
  language: '',
  prerequisites: '',
  thumbnail_photo_path: '',
  courseType: 'online',
  modules: [],
  physicalCourseData: {
    title: '',
    price: 0,
    duration: '',
    includes: '',
    description: '',
    location: ''
  },
  materials: [],
  region_id: null,
  offline_training_hours: null,
};
interface ModalQuizQuestionDto {
  question: string;
  type: number;
  options?: string;
  correct_answers: string;
  points: number;
}

interface ModalQuizDto {
  title: string;
  description: string;
  passing_score: number;
  max_attempts: number;
  questions: ModalQuizQuestionDto[];
}

function quizToModalFormat(quiz: Quiz | undefined): ModalQuizDto | undefined {
  if (!quiz) return undefined;
  return {
    title: quiz.title,
    description: quiz.description,
    passing_score: quiz.passPercentage,
    max_attempts: Number(quiz.max_attempts),
    questions: (quiz.questions || []).map((q): ModalQuizQuestionDto => ({
      question: q.question,
      type: q.type === 'mcq' ? 0 : q.type === 'true-false' ? 1 : 2,
      options: (q.options || []).join(','),
      correct_answers: typeof q.correctAnswer === 'boolean'
        ? (q.correctAnswer ? 'true' : 'false')
        : (q.correctAnswer || ''),
      points: q.points,
    })),
  };
}

function modalToQuizFormat(modalQuiz: ModalQuizDto): Quiz {
  return {
    title: modalQuiz.title,
    description: modalQuiz.description,
    passPercentage: Number(modalQuiz.passing_score),
    max_attempts: modalQuiz.max_attempts?.toString() || "1",
    questions: (modalQuiz.questions || []).map((q: ModalQuizQuestionDto) => ({
      question: q.question,
      type: q.type === 0 ? 'mcq' : q.type === 1 ? 'true-false' : 'short-answer',
      options: typeof q.options === 'string' && q.options.length > 0
        ? q.options.split(',').map((s: string) => s.trim())
        : [],
      correctAnswer: q.correct_answers,
      points: q.points,
    })),
  };
}
// Helper function to transform API response to component format
interface ApiLesson {
  lesson_title?: string;
  lesson_description?: string;
  duration?: number;
  lesson_attachment_path?: string;
}

interface ApiQuestion {
  id?: number | string;
  type: number;
  question?: string;
  options?: string;
  correct_answers?: string;
  explanation?: string;
  points?: number;
}

interface ApiQuiz {
  title?: string;
  description?: string;
  questions?: ApiQuestion[];
  passing_score?: number;
  time_limit?: number;
  max_attempts: number;
}

interface ApiCourseModule {
  module_title?: string;
  module_description?: string;
  course_module_lessons?: ApiLesson[];
  quizzes?: ApiQuiz[];
}

interface AdminCourseApiResponse {
  id?: number | string;
  title?: string;
  description?: string;
  content?: string;
  category?: string;
  price?: number;
  duration?: number;
  level?: string;
  language?: string;
  prerequisites?: string;
  thumbnail_photo_path?: string;
  course_type: number;
  includes?: string;
  location?: string;
  course_modules?: ApiCourseModule[];
  materials?: CourseMaterial[];
  region_id?: number | null;
  offline_training_hours?: number | null;
}

const transformApiResponseToCourse = (apiResponse: AdminCourseApiResponse): Course => {
  let courseType: CourseType;
  if (apiResponse.course_type === 0) {
    courseType = 'online';
  } else if (apiResponse.course_type === 1) {
    courseType = 'physical';
  } else {
    courseType = 'hybrid';
  }
  
  const modules = apiResponse.course_modules?.map((module: ApiCourseModule, index: number) => ({
    title: module.module_title || '',
    description: module.module_description || '',
          subsections: module.course_module_lessons?.map((lesson: ApiLesson) => ({
      title: lesson.lesson_title || '',
      description: lesson.lesson_description || '',
      duration: lesson.duration || 0,
      videoUrl: lesson.lesson_attachment_path || '',
    })) || [],
    quiz: module.quizzes && module.quizzes.length > 0 ? {
      title: module.quizzes[0].title || '',
      description: module.quizzes[0].description || '',
      questions: module.quizzes[0].questions?.map((question: ApiQuestion) => {
        const mappedType: Question['type'] = question.type === 0 ? 'mcq' : question.type === 1 ? 'true-false' : 'short-answer';
        return {
          id: question.id?.toString() || undefined,
          type: mappedType,
          question: question.question || '',
          options: question.options ? question.options.split(',') : [],
          correctAnswer: mappedType === 'true-false' ? (question.correct_answers === 'true') : (question.correct_answers || ''),
          explanation: question.explanation || '',
          points: question.points || 1,
        } as Question;
      }) || [],
      passPercentage: module.quizzes[0].passing_score || 60,
      timeLimit: module.quizzes[0].time_limit,
      max_attempts: module.quizzes[0].max_attempts.toString(),
      
    } : undefined,
    isExpanded: false,
    isQuizExpanded: false,
    materials: [],
  })) || [];

  return {
    id: apiResponse.id?.toString(),
    title: apiResponse.title || '',
    description: apiResponse.description || '',
    content: apiResponse.content || '',
    category: apiResponse.category || '',
    price: apiResponse.price || 0,
    duration: apiResponse.duration || 0,
    level: apiResponse.level || '',
    language: apiResponse.language || '',
    prerequisites: apiResponse.prerequisites || '',
    thumbnail_photo_path: apiResponse.thumbnail_photo_path || '',
    courseType,
    modules,
    physicalCourseData: courseType === 'physical' ? {
      title: apiResponse.title || '',
      price: apiResponse.price || 0,
      duration: apiResponse.duration?.toString() || '',
      includes: apiResponse.includes || '',
      description: apiResponse.description || '',
      location: apiResponse.location || ''
    } : undefined,
    materials: apiResponse.materials || [],
    region_id: apiResponse.region_id,
    offline_training_hours: apiResponse.offline_training_hours,
  };
};

const UploadCourse: React.FC<UploadCourseProps> = ({ initialCourse, mode = 'add' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Get course details from Redux store for edit mode
  const{ loading, courseDetails, error: courseListError } = useSelector((state: RootState) => state.adminCourseList);
  const { regions } = useSelector((state: RootState) => state.regionList);

  const [course, setCourse] = useState<Course>(initialCourse || defaultCourse);
  const [isLoading, setIsLoading] = useState(false);
console.log(course);

  // Effect to handle edit mode data loading
  useEffect(() => {
    if (mode === 'edit' && id && !initialCourse) {
      setIsLoading(true);
      dispatch(getAdminCourseDetails(id));
    }
  }, [mode, id, initialCourse, dispatch]);

  // Effect to fetch regions once if not present in store
  useEffect(() => {
    if (!regions || regions.length === 0) {
      dispatch(getAdminRegionList());
    }
  }, [dispatch, regions]);

  // Effect to set course data when course details are loaded
  useEffect(() => {
    if (mode === 'edit' && courseDetails && !initialCourse) {
      try {
        const transformedCourse = transformApiResponseToCourse(courseDetails as unknown as AdminCourseApiResponse);
        setCourse(transformedCourse);
        setIsLoading(false);
      } catch (error) {
        console.error('Error transforming course data:', error);
        toast({
          title: "Error",
          description: "Failed to load course details.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    }
    
  }, [courseDetails, mode, initialCourse]);

  // Effect to handle initial course prop
  useEffect(() => {
    if (initialCourse) {
      setCourse(initialCourse);
    }
  }, [initialCourse]);

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [quizModal, setQuizModal] = useState<{ open: boolean; moduleIdx: number | null }>({ open: false, moduleIdx: null });
  const [materialModal, setMaterialModal] = useState<{ open: boolean; moduleIdx: number | null }>({ open: false, moduleIdx: null });
  const handleMaterialSave = (materials: ModuleMaterial[]) => {
    if (materialModal.moduleIdx === -1) {
      setCourse(prev => ({ ...prev, materials }));
    } else if (materialModal.moduleIdx !== null) {
      const newModules = [...course.modules];
      newModules[materialModal.moduleIdx].materials = materials;
      setCourse({ ...course, modules: newModules });
    }
  };

  // Dynamically compute steps: remove Content step for physical/hybrid
  const computedSteps = React.useMemo(() => {
    if (course?.courseType === 'online' || course?.courseType === 'hybrid') return steps;
    return steps.filter((s) => s.key !== 'content');
  }, [course?.courseType]);

  // Clamp step index when course type changes (e.g., online -> physical/hybrid)
  useEffect(() => {
    const maxIndex = computedSteps.length - 1;
    if (currentStep > maxIndex) setCurrentStep(maxIndex);
  }, [computedSteps.length, currentStep]);

  // --- Step validation logic ---
  const isTypeStepValid = !!course?.courseType;
  const isInfoStepValid =
    course?.title.trim() &&
    course?.description.trim() &&
    course?.category &&
    course?.price > 0 &&
    course?.thumbnail_photo_path.trim() &&
    (course?.courseType === 'online' ? course?.duration > 0 : true) &&
    (course?.courseType !== 'online' ? course?.region_id && course?.offline_training_hours : true);

  const isContentStepValid =
    course?.courseType === 'online'
      ? (course?.modules.length > 0 &&
        course?.modules.every((m) => m.title.trim() && m.subsections.length > 0))
      : true;

  // --- Navigation logic ---
  const canGoNext = () => {
    const stepKey = computedSteps[currentStep]?.key;
    if (stepKey === 'type') return isTypeStepValid;
    if (stepKey === 'info') return isInfoStepValid;
    if (stepKey === 'content') return isContentStepValid;
    return true;
  };

  const goNext = () => {
    // Validate current step before proceeding
    const stepKey = computedSteps[currentStep]?.key;
    if (stepKey === 'type') {
      if (!course?.courseType) {
        alert('Please select a course type to continue.');
        return;
      }
    } else if (stepKey === 'info') {
      const missingFields = [];
      if (!course?.title?.trim()) missingFields.push('Course Title');
      if (!course?.description?.trim()) missingFields.push('Course Description');
      if (!course?.content?.trim()) missingFields.push('Course Content');
      if (!course?.category) missingFields.push('Category');
      if (!course?.price || course?.price <= 0) missingFields.push('Price');
      if ((course?.courseType === 'online' || course?.courseType === 'hybrid') && (!course?.duration || course?.duration <= 0)) missingFields.push('Online Duration');
      if (!course?.level?.trim()) missingFields.push('Level');
      if (!course?.language?.trim()) missingFields.push('Language');
      if (!course?.prerequisites?.trim()) missingFields.push('Prerequisites');
      if (!course?.thumbnail_photo_path?.trim()) missingFields.push('Thumbnail Image');
      if (course?.courseType !== 'online') {
        if (!course?.region_id) missingFields.push('Region');
        if (!course?.offline_training_hours) missingFields.push('Offline Training Hours');
      }
      
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields:\n\n${missingFields.join('\n')}`);
        return;
      }
    } else if (stepKey === 'content') {
      if (!course?.modules || course?.modules.length === 0) {
        alert('Please add at least one module to continue.');
        return;
      }
      
      const missingFields = [];
      course?.modules.forEach((module, moduleIndex) => {
        if (!module.title?.trim()) {
          missingFields.push(`Module ${moduleIndex + 1} Title`);
        }
        if (!module.subsections || module.subsections.length === 0) {
          missingFields.push(`At least one lesson in Module ${moduleIndex + 1}`);
        } else {
          module.subsections.forEach((subsection, lessonIndex) => {
            if (!subsection.title?.trim()) {
              missingFields.push(`Lesson ${lessonIndex + 1} Title in Module ${moduleIndex + 1}`);
            }
            if (!subsection.videoUrl?.trim()) {
              missingFields.push(`Lesson ${lessonIndex + 1} Video URL in Module ${moduleIndex + 1}`);
            }
          });
        }
      });
      
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields:\n\n${missingFields.join('\n')}`);
        return;
      }
    }
    
    // If validation passes, proceed to next step
    if (currentStep < computedSteps.length - 1) setCurrentStep(currentStep + 1);
  };
  const goBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  // --- Modal Save Handlers ---


  // --- Module logic (add, remove, update, etc.) ---
  const handleCourseTypeChange = (type: CourseType) => {
    setCourse(prev => ({
      ...prev,
      courseType: type,
      // Clear all form content when course type changes
      title: '',
      description: '',
      content: '',
      category: '',
      price: 0,
      duration: 0,
      level: '',
      language: '',
      prerequisites: '',
      thumbnail_photo_path: '',
      modules: type === 'online' ? [] : [],
      physicalCourseData: type === 'online' ? undefined : {
        title: '',
        price: 0,
        duration: '',
        includes: '',
        description: '',
        location: ''
      },
      materials: [],
      region_id: null,
      offline_training_hours: null,
    }));
    
    // Reset to first step when course type changes
    setCurrentStep(0);
  };

  

  const addModule = () => {
    setCourse({
      ...course,
      modules: [
        ...course.modules,
        { title: '', description: '', subsections: [], isExpanded: true, isQuizExpanded: false, materials: [] },
      ],
    });
  };

  const removeModule = (moduleIndex: number) => {
    const newModules = [...course.modules];
    newModules.splice(moduleIndex, 1);
    setCourse({ ...course, modules: newModules });
  };

  const updateModule = (moduleIndex: number, field: string, value: string | boolean) => {
    const newModules = [...course.modules];
    newModules[moduleIndex] = { ...newModules[moduleIndex], [field]: value };
    setCourse({ ...course, modules: newModules });
  };

  const toggleModuleExpansion = (moduleIndex: number) => {
    updateModule(moduleIndex, 'isExpanded', !course?.modules[moduleIndex].isExpanded);
  };

  const addSubsection = (moduleIndex: number) => {
    const newModules = [...course.modules];
    newModules[moduleIndex].subsections = [
      ...newModules[moduleIndex].subsections,
      { title: '', videoUrl: '' },
    ];
    setCourse({ ...course, modules: newModules });
  };

  const removeSubsection = (moduleIndex: number, subsectionIndex: number) => {
    const newModules = [...course.modules];
    newModules[moduleIndex].subsections.splice(subsectionIndex, 1);
    setCourse({ ...course, modules: newModules });
  };

  const updateSubsection = (
    moduleIndex: number,
    subsectionIndex: number,
    field: string,
    value: string
  ) => {
    const newModules = [...course.modules];
    newModules[moduleIndex].subsections[subsectionIndex] = {
      ...newModules[moduleIndex].subsections[subsectionIndex],
      [field]: value,
    };
    setCourse({ ...course, modules: newModules });
  };

  // --- Submit Handler with dispatch ---
  const handleSubmit = async () => {
    // Validate required fields before submitting
    const requiredFields = [];
    
    if (!course?.title?.trim()) requiredFields.push('Course Title');
    if (!course?.description?.trim()) requiredFields.push('Course Description');
    if (!course?.content?.trim()) requiredFields.push('Course content');

    if (!course?.category?.trim()) requiredFields.push('Category');
    if (!course?.price || course?.price <= 0) requiredFields.push('Price');
    if ((course?.courseType === 'online' || course?.courseType === 'hybrid') && (!course?.duration || course?.duration <= 0)) requiredFields.push('Online Duration');
    if (!course?.level?.trim()) requiredFields.push('Level');
    if (!course?.language?.trim()) requiredFields.push('Language');
    if (!course?.thumbnail_photo_path?.trim()) requiredFields.push('Thumbnail Image');
    if(!course?.prerequisites?.trim()) requiredFields.push('Prerequisites');
    
    // For offline and hybrid courses, validate region_id and offline_training_hours
    if (course?.courseType !== 'online') {
      if (!course?.region_id) requiredFields.push('Region');
      if (!course?.offline_training_hours) requiredFields.push('Offline Training Hours');
    }
    
    // For online courses only, validate modules and lessons
    if (course?.courseType === 'online') {
      if (!course?.modules || course?.modules.length === 0) {
        requiredFields.push('At least one module');
      } else {
        course?.modules.forEach((module, moduleIndex) => {
          if (!module.title?.trim()) {
            requiredFields.push(`Module ${moduleIndex + 1} Title`);
          }
          if (!module.subsections || module.subsections.length === 0) {
            requiredFields.push(`At least one lesson in Module ${moduleIndex + 1}`);
          } else {
            module.subsections.forEach((subsection, lessonIndex) => {
              if (!subsection.title?.trim()) {
                requiredFields.push(`Lesson ${lessonIndex + 1} Title in Module ${moduleIndex + 1}`);
              }
              if (!subsection.videoUrl?.trim()) {
                requiredFields.push(`Lesson ${lessonIndex + 1} Video URL in Module ${moduleIndex + 1}`);
              }
            });
          }
        });
      }
    }
    
    // Validate course materials if any are added
    if (course?.materials && course.materials.length > 0) {
      course.materials.forEach((material, index) => {
        if (!material.name?.trim()) requiredFields.push(`Material ${index + 1} Title`);
        if (!material.url?.trim()) requiredFields.push(`Material ${index + 1} File Path`);
      });
    }
    
    // If there are missing required fields, show alert and return
    if (requiredFields.length > 0) {
      const missingFieldsMessage = `Please fill in the following required fields:\n\n${requiredFields.join('\n')}`;
      alert(missingFieldsMessage);
      return;
    }

    try {
      setIsLoading(true);
      
      const base64 = course?.thumbnail_photo_path;
      let thumbnail_photo_base64_code = undefined;
      let thumbnail_photo_path = undefined;

      if (base64 && base64.startsWith('data:image')) {
        // New image selected, send the complete data URL as base64
        // Backend will handle splitting and extracting the base64 part
thumbnail_photo_base64_code = base64.split(',')[1]; 


} else if (base64 && base64.trim() !== '') {
        // Existing image path, send only as path
        thumbnail_photo_path = base64;
      }

      const payload = {
        title: course?.title,
        description: course?.description,
        content: course?.content,
        category: course?.category,
        price: Number(course?.price),
        // For hybrid, send both online and offline fields
        duration: course?.courseType === 'online' || course?.courseType === 'hybrid'
          ? parseFloat(String(course?.duration))
          : null,
        level: course?.level,
        language: course?.language,
        prerequisites: course?.prerequisites,
        ...(thumbnail_photo_base64_code && { thumbnail_photo_base64_code }),
        ...(thumbnail_photo_path && { thumbnail_photo_path }),
        course_type: course?.courseType === 'online' ? 0 : course?.courseType === 'physical' ? 1 : 2,
        // For hybrid, send both region_id and offline_training_hours
        region_id: course?.courseType === 'physical' || course?.courseType === 'hybrid'
          ? course?.region_id
          : null,
        offline_training_hours: course?.courseType === 'physical' || course?.courseType === 'hybrid'
          ? course?.offline_training_hours
          : null,
        course_materials: course?.materials?.map(material => {
          if (material.url && material.url.trim() !== '') {
            return {
              title: material.name,
              file_path: material.url
            };
          }
          return null;
        }).filter(Boolean) || [],
        course_modules:
          course?.courseType === 'online' || course?.courseType === 'hybrid'
            ? course?.modules.map((mod, idx) => ({
                module_title: mod.title,
                module_description: mod.description,
                sequence: idx,
                course_module_lessons: mod.subsections.map((sub, subIdx) => ({
                  lesson_title: sub.title,
                  lesson_description: sub.description,
                  lesson_attachment_path: sub.videoUrl,
                  duration: parseFloat(String(sub.duration)) || 0,
                  sequence: subIdx,
                })),
                quizzes: mod.quiz
                  ? [
                      {
                        title: mod.quiz.title,
                        description: mod.quiz.description,
                        passing_score: mod.quiz.passPercentage,
                        max_attempts: Number(mod.quiz.max_attempts) || 1,
                        quiz_questions: mod.quiz.questions.map((q, qIdx) => ({
                          question: q.question,
                          type: q.type === 'mcq' ? 0 : q.type === 'true-false' ? 1 : 2,
                          options: q.options ? q.options.join(',') : '',
                          correct_answers: typeof q.correctAnswer === 'string' ? q.correctAnswer : q.correctAnswer ? 'true' : 'false',
                          points: q.points,
                          order_index: qIdx,
                        })),
                      },
                    ]
                  : [],
              }))
            : null,
      };

      if (mode === 'edit' && course?.id) {
      await dispatch(updateAdminCourse(course?.id, payload));
        toast({
          title: "Course updated!",
          description: "Your course has been successfully updated.",
        });
      } else {
        
      await dispatch(createAdminCourse(payload));
        toast({
          title: "Course published!",
          description: "Your course has been successfully uploaded.",
        });
      }

      navigate("/admin", { state: { activeTab: "course-list" } });
    } catch (err) {
      console.error('Error submitting course:', err);
      toast({
        title: "Error",
        description: mode === 'edit' ? "Failed to update course?." : "Failed to publish course?.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
    
  // Show loading state
  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course details...</p>
        </div>
      </div>
    );
  }

  // --- Stepper UI ---
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                NL Driving              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="outline" onClick={() => setIsPreviewMode(!isPreviewMode)}>
                <Eye className="h-4 w-4 mr-2" />
                {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {mode === 'edit' ? 'Edit Course' : 'Create New Course'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {mode === 'edit' 
              ? 'Update your course details and content' 
              : 'Build and publish your driving education course'
            }
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-8">
          {computedSteps.map((step, idx) => (
            <React.Fragment key={step.key}>
              <div className={`flex flex-col items-center ${idx === currentStep ? 'text-blue-600 font-bold' : 'text-muted-foreground'}`}>
                <div className={`rounded-full border-2 w-8 h-8 flex items-center justify-center mb-1 ${idx === currentStep ? 'border-blue-600' : 'border-border'}`}>
                  {idx + 1}
                </div>
                <span className="text-xs">{step.label}</span>
              </div>
              {idx < computedSteps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${idx < currentStep ? 'bg-blue-600' : 'bg-border'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Course Type */}
            {computedSteps[currentStep]?.key === 'type' && (
              <Card>
                <CardHeader>
                  <CardTitle>Course Type</CardTitle>
                  <CardDescription>Choose the type of driving course you want to create</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={course?.courseType} 
                    onValueChange={(value) => handleCourseTypeChange(value as CourseType)}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="online" id="online" />
                      <label htmlFor="online" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Monitor className="h-8 w-8 text-blue-600" />
                        <div>
                          <p className="font-medium">Online Course</p>
                          <p className="text-sm text-muted-foreground">Video-based learning with modules</p>
                        </div>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="physical" id="physical" />
                      <label htmlFor="physical" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Car className="h-8 w-8 text-green-600" />
                        <div>
                          <p className="font-medium">Physical Course</p>
                          <p className="text-sm text-muted-foreground">In-car instruction and practice</p>
                        </div>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="hybrid" id="hybrid" />
                      <label htmlFor="hybrid" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Monitor className="h-8 w-8 text-blue-600" />
                        <Car className="h-8 w-8 text-green-600 ml-2" />
                        <div>
                          <p className="font-medium">Hybrid Course</p>
                          <p className="text-sm text-muted-foreground">Online modules + in-car instruction</p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Course Info */}
            {computedSteps[currentStep]?.key === 'info' && (
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                  <CardDescription>Basic details about your course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      value={course?.title}
                      onChange={(e) => setCourse({ ...course, title: e.target.value })}
                      placeholder={course?.courseType === 'physical' ? "e.g., Test Prep Package" : "e.g., Complete Online Driver's Ed"}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Course Description</Label>
                    <Textarea
                      id="description"
                      value={course?.description}
                      onChange={(e) => setCourse({ ...course, description: e.target.value })}
                      placeholder={course?.courseType === 'physical' 
                        ? "Describe the benefits and preparation this physical course provides..."
                        : "Describe what students will learn in this online course?..."
                      }
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Course Content Summary</Label>
                    <Textarea
                      id="content"
                      value={course?.content}
                      onChange={(e) => setCourse({ ...course, content: e.target.value })}
                      placeholder="Brief summary of the course content"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={course?.category} onValueChange={(value) => setCourse({ ...course, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner-driver-ed">Beginner Driver Education</SelectItem>
                          <SelectItem value="defensive-driving">Defensive Driving</SelectItem>
                          <SelectItem value="test-preparation">Test Preparation</SelectItem>
                          <SelectItem value="refresher-course">Refresher Course</SelectItem>
                          <SelectItem value="advanced-driving">Advanced Driving Skills</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (CAD)</Label>
                      <Input
                        id="price"
                        type="number"
                          step="0.01"
                          inputMode="decimal"
                        value={course?.price || ''}
                        onChange={(e) => {
                          setCourse({ ...course, price: parseFloat(e.target.value) || 0 });
                        }}
                        placeholder="e.g. 99.99"
                      />
                    </div>
                    {(course?.courseType === 'online' || course?.courseType === 'hybrid') && (
                      <div className="space-y-2">
                        <Label htmlFor="duration">Online Duration (hours)</Label>
                        <Input
                          id="duration"
                          type="number"
                          step="0.01"
                          inputMode="decimal"
                          value={course?.duration || ''}
                          onChange={(e) => setCourse({ ...course, duration: parseFloat(e.target.value) || 0 })}
                          placeholder="e.g. 20.5"
                        />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">Level</Label>
                      <Input
                        id="level"
                        value={course?.level}
                        onChange={(e) => setCourse({ ...course, level: e.target.value })}
                        placeholder="e.g. Beginner, Intermediate, Advanced"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Input
                        id="language"
                        value={course?.language}
                        onChange={(e) => setCourse({ ...course, language: e.target.value })}
                        placeholder="e.g. English"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prerequisites">Prerequisites</Label>
                      <Input
                        id="prerequisites"
                        value={course?.prerequisites}
                        onChange={(e) => setCourse({ ...course, prerequisites: e.target.value })}
                        placeholder="e.g. None, Basic driving knowledge"
                      />
                    </div>
                  </div>
                  {/* Region and Offline Training Hours - Only for offline and hybrid courses */}
                  {(course?.courseType === 'physical' || course?.courseType === 'hybrid') && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="region_id">Region</Label>
                        <Select
                          value={course?.region_id?.toString() || ''}
                          onValueChange={(value) => setCourse({ ...course, region_id: Number(value) || null })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a region" />
                          </SelectTrigger>
                          <SelectContent>
                            {regions?.map((region) => (
                              <SelectItem key={region.id} value={region.id?.toString() || ''}>
                                {region.region_name || `Region ${region.id}`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="offline_training_hours">Offline Training Hours</Label>
                        <Input
                          id="offline_training_hours"
                          type="number"
                          step="0.01"
                          inputMode="decimal"
                          value={course?.offline_training_hours?.toString() || ''}
                          onChange={(e) => setCourse({ ...course, offline_training_hours: parseFloat(e.target.value) || null })}
                          placeholder="e.g. 10.5"
                        />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail_photo_path">Thumbnail Image</Label>
                    <Input
                      id="thumbnail_photo_path"
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Validate file size (max 5MB)
                          if (file.size > 5 * 1024 * 1024) {
                            alert('Image file size must be less than 5MB');
                            return;
                          }
                          
                          // Validate file type
                          if (!file.type.startsWith('image/')) {
                            alert('Please select a valid image file');
                            return;
                          }

                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const result = reader.result as string;
                            if (result && result.startsWith('data:image/')) {
                              setCourse({ ...course, thumbnail_photo_path: result });
                            } else {
                              alert('Failed to read image file. Please try again.');
                            }
                          };
                          reader.onerror = () => {
                            alert('Error reading image file. Please try again.');
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {course?.thumbnail_photo_path && (
                      <div className="mt-2">
                        <img 
        src={
  course?.thumbnail_photo_path?.startsWith('data:image')
    ? course.thumbnail_photo_path
    : import.meta.env.VITE_API_BASE_URL + "/" + course?.thumbnail_photo_path
}
        alt="Course thumbnail_photo_path preview" 
                          className="w-32 h-20 object-cover rounded border"
                        />
                      </div>
                    )}
                  </div>
                  {/* {course?.courseType === 'physical' && (
                    <PhysicalCourseForm 
                      data={course?.physicalCourseData!}
                      onChange={handlePhysicalCourseDataChange}
                    />
                  )} */}
                </CardContent>
              </Card>
            )}

            {/* Course Materials section is commented out for all course types */}

            {/* Step 4: Content */}
            {computedSteps[currentStep]?.key === 'content'  && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        Course Content
                      </CardTitle>
                      <CardDescription>
                        Organize your content into modules with lessons and optional quizzes for assessment.
                      </CardDescription>
                    </div>
                    <Button onClick={addModule} size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Module
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course?.modules.map((module, moduleIndex) => (
                    <Card key={moduleIndex} className="border-2 border-dashed border-border">
                      <Collapsible
                        open={module.isExpanded}
                        onOpenChange={() => toggleModuleExpansion(moduleIndex)}
                      >
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                {module.isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                )}
                                <div>
                                  <CardTitle className="text-lg">
                                    Module {moduleIndex + 1}: {module.title || 'Untitled Module'}
                                  </CardTitle>
                                  <CardDescription className="flex items-center gap-4">
                                    <span>{module.subsections.length} lesson{module.subsections.length !== 1 ? 's' : ''}</span>
                                    {module.quiz && (
                                      <Badge variant="secondary" className="text-xs">
                                        <Brain className="h-3 w-3 mr-1" />
                                        Quiz ({module.quiz.questions.length} questions)
                                      </Badge>
                                    )}
                                  </CardDescription>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeModule(moduleIndex);
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="space-y-6 border-t border-border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Module Title</Label>
                                <Input
                                  value={module.title}
                                  onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                                  placeholder="e.g., Introduction to Road Safety"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Module Description</Label>
                                <Input
                                  value={module.description}
                                  onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                                  placeholder="Brief description of this module"
                                />
                              </div>
                            </div>
                            {/* Lessons Section */}
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium text-foreground flex items-center">
                                  <Video className="h-4 w-4 mr-2" />
                                  Lessons
                                </h4>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addSubsection(moduleIndex)}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Lesson
                                </Button>
                              </div>
                              {/* Subsections */}
                              {module.subsections.map((subsection, subsectionIndex) => (
                                <Card key={subsectionIndex} className="bg-muted/30">
                                  <CardContent className="p-4">
                                    <div className="flex justify-between items-start mb-3">
                                      <Badge variant="outline" className="text-xs">
                                        Lesson {subsectionIndex + 1}
                                      </Badge>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeSubsection(moduleIndex, subsectionIndex)}
                                        className="text-red-600 hover:text-red-700 -mt-1 -mr-1"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                    <div className="space-y-3">
                                      <Input
                                        value={subsection.title}
                                        onChange={(e) => updateSubsection(moduleIndex, subsectionIndex, 'title', e.target.value)}
                                        placeholder="Lesson title (e.g., Traffic Signs and Signals)"
                                        className="bg-background"
                                      />
                                      <Input
                                      value={subsection.description}
                                        onChange={(e) => updateSubsection(moduleIndex, subsectionIndex, 'description', e.target.value)}
                                        placeholder="Brief description of this lesson"
                                        className="bg-background"
                                      />
                                       
                                      <Input
                                        type="text"
                                        value={subsection.duration || ''}
                                        onChange={(e) => updateSubsection(moduleIndex, subsectionIndex, 'duration', e.target.value)}
                                        placeholder="Duration (in minutes)"
                                        className="bg-background"
                                      />
                                      <Input
                                        value={subsection.videoUrl}
                                        onChange={(e) => updateSubsection(moduleIndex, subsectionIndex, 'videoUrl', e.target.value)}
                                        placeholder="Video URL (YouTube, Vimeo, or direct link)"
                                        className="bg-background"
                                      />
                                      {/* PDF upload input */}
                                      <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor={`lesson-pdf-${moduleIndex}-${subsectionIndex}`}>Lesson PDF (optional)</label>
                                        <Input
                                          id={`lesson-pdf-${moduleIndex}-${subsectionIndex}`}
                                          type="file"
                                          accept="application/pdf"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              const reader = new FileReader();
                                              reader.onloadend = () => {
                                                const base64 = reader.result as string;
                                                updateSubsection(moduleIndex, subsectionIndex, 'pdfUrl', base64);
                                              };
                                              reader.readAsDataURL(file);
                                            } else {
                                              updateSubsection(moduleIndex, subsectionIndex, 'pdfUrl', '');
                                            }
                                          }}
                                          className="bg-background"
                                        />
                                        {/* Show selected file name if a file is chosen */}
                                        {subsection.pdfUrl && (
                                          <div className="text-xs text-muted-foreground mt-1">PDF selected</div>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                              {module.subsections.length === 0 && (
                                <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
                                  <Video className="h-6 w-6 mx-auto mb-2 opacity-50" />
                                  <p className="text-sm">No lessons yet. Click "Add Lesson" to create your first video lesson.</p>
                                </div>
                              )}
                            </div>
                            <Separator />
                            {/* Quiz Section */}
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium text-foreground flex items-center">
                                  <Brain className="h-4 w-4 mr-2" />
                                  Module Quiz (Optional)
                                </h4>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setQuizModal({ open: true, moduleIdx: moduleIndex })}
                                >
                                  {module.quiz ? "Edit Quiz" : "Add Quiz"}
                                </Button>
                              </div>
                              {module.quiz && (
                                <div className="text-muted-foreground text-xs">
                                  {module.quiz.questions.length} question(s) in this quiz.
                                </div>
                              )}
                            </div>
                            {/* Materials Section */}
                            {/* <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium text-foreground flex items-center">
                                  <BookOpen className="h-4 w-4 mr-2" />
                                  Module Materials
                                </h4>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setMaterialModal({ open: true, moduleIdx: moduleIndex })}
                                >
                                  Edit Materials
                                </Button>
                              </div>
                              <ul className="mb-2 space-y-2">
                                {(module.materials || []).map((mat, matIdx) => (
                                  <li key={matIdx} className="flex items-center gap-2 text-xs">
                                    <a href={mat.url} target="_blank" rel="noopener noreferrer" className="underline">{mat.name || mat.url}</a>
                                  </li>
                                ))}
                              </ul>
                              {(module.materials?.length ?? 0) === 0 && (
                                <div className="text-muted-foreground text-xs">
                                  No materials for this module.
                                </div>
                              )}
                            </div> */}
                          </CardContent>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                  ))}
                  {course?.modules.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No modules yet</h3>
                      <p className="mb-4">Start building your online course by adding your first module.</p>
                      <Button onClick={addModule} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"/>
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Module
                      </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 5: Preview & Publish */}
            {computedSteps[currentStep]?.key === 'preview' && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview & Publish</CardTitle>
                  <CardDescription>Review your course before publishing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h3 className="font-bold text-lg mb-2">Preview</h3>
                    <div>Title: {course?.title}</div>
                    <div>Description: {course?.description}</div>
                    <div>Category: {course?.category}</div>
                    <div>Price: ${course?.price}</div>
                    <div>Type: {course?.courseType}</div>
                    <div>Materials: {course?.materials.length} file(s)</div>
                  </div>
                  <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    {mode === 'edit' ? 'Update Course' : 'Publish Course'}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step Navigation */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={goBack} disabled={currentStep === 0}>
                Back
              </Button>
              {currentStep < computedSteps.length - 1 && (
                <Button onClick={goNext}>
                  Next
                </Button>
              )}
            </div>
          </div>

          {/* Course Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {course?.courseType === 'physical' ? <Car className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                    Course Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course?.thumbnail_photo_path && (
                    <img
                      src={
  course?.thumbnail_photo_path?.startsWith('data:image')
    ? course.thumbnail_photo_path
    : import.meta.env.VITE_API_BASE_URL + "/" + course?.thumbnail_photo_path
}
                      alt="Course thumbnail_photo_path"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  )}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-lg">{course?.title || 'Course Title'}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {course?.description || 'Course description will appear here...'}
                      </p>
                    </div>
                    <Badge variant={course?.courseType === 'physical' ? 'default' : 'secondary'} className="ml-2">
                      {course?.courseType === 'physical' ? 'Physical' : 'Online'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    {course?.category && (
                      <Badge variant="outline">{course?.category.replace('-', ' ')}</Badge>
                    )}
                    {course?.price > 0 && (
                      <span className="text-lg font-bold text-blue-600">${course?.price} CAD</span>
                    )}
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Course Content</h4>
                    {course?.courseType === 'physical' ? (
                      <div className="space-y-3">
                        <div className="text-sm text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Duration:</span>
                            <span className="font-medium">{course?.physicalCourseData?.duration || 'TBD'}</span>
                          </div>
                          {course?.physicalCourseData?.location && (
                            <div className="flex justify-between">
                              <span>Location:</span>
                              <span className="font-medium">{course?.physicalCourseData.location}</span>
                            </div>
                          )}
                          {course?.region_id && (
                            <div className="flex justify-between">
                              <span>Region:</span>
                              <span className="font-medium">
                                {regions?.find(r => r.id === course.region_id)?.region_name || `Region ${course.region_id}`}
                              </span>
                            </div>
                          )}
                          {course?.offline_training_hours && (
                            <div className="flex justify-between">
                              <span>Offline Training Hours:</span>
                              <span className="font-medium">{course.offline_training_hours} hours</span>
                            </div>
                          )}
                        </div>
                        {course?.physicalCourseData?.includes && (
                          <div>
                            <h5 className="text-sm font-medium mb-2">What's Included:</h5>
                            <div className="space-y-1">
                              {course?.physicalCourseData.includes.split('\n').filter(item => item.trim()).map((item, index) => (
                                <div key={index} className="text-xs text-muted-foreground flex items-center">
                                  <div className="h-1 w-1 bg-blue-600 rounded-full mr-2"></div>
                                  {item.trim()}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : course?.courseType === 'hybrid' ? (
                      <div className="space-y-3">
                        <div className="text-sm text-muted-foreground">
                          {course?.region_id && (
                            <div className="flex justify-between">
                              <span>Region:</span>
                              <span className="font-medium">
                                {regions?.find(r => r.id === course.region_id)?.region_name || `Region ${course.region_id}`}
                              </span>
                            </div>
                          )}
                          {course?.offline_training_hours && (
                            <div className="flex justify-between">
                              <span>Offline Training Hours:</span>
                              <span className="font-medium">{course.offline_training_hours} hours</span>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">{course?.modules.length}</span> modules
                          </div>
                          <div>
                            <span className="font-medium">{course?.modules.reduce((total, module) => total + module.subsections.length, 0)}</span> lessons
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">{course?.modules.filter(module => module.quiz && module.quiz.questions.length > 0).length}</span> quizzes
                          </div>
                          {course?.modules.reduce((total, module) => total + module.subsections.length, 0) > 0 && (
                            <div>
                              <span className="font-medium">{`${Math.ceil(course?.modules.reduce((total, module) => total + module.subsections.length, 0) * 1.5)} hours`}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {course?.modules.map((module, index) => (
                            <div key={index} className="text-sm">
                              <div className="font-medium text-foreground flex items-center">
                                <BookOpen className="h-3 w-3 mr-2" />
                                Module {index + 1}: {module.title || 'Untitled Module'}
                              </div>
                              <div className="ml-5 text-muted-foreground space-y-1">
                                <div>
                                  {module.subsections.length} lesson{module.subsections.length !== 1 ? 's' : ''}
                                </div>
                                {module.quiz && (
                                  <div className="flex items-center text-xs">
                                    <Brain className="h-2 w-2 mr-1" />
                                    Quiz ({module.quiz.questions.length} questions)
                                  </div>
                                )}
                                {module.subsections.length > 0 && (
                                  <div className="ml-2 space-y-1">
                                    {module.subsections.map((subsection, subIndex) => (
                                      <div key={subIndex} className="text-xs flex items-center">
                                        <Video className="h-2 w-2 mr-1" />
                                        {subsection.title || `Lesson ${subIndex + 1}`}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {course?.modules.length === 0 && (
                            <div className="text-muted-foreground text-sm">
                              No modules added yet
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">{course?.modules.length}</span> modules
                          </div>
                          <div>
                            <span className="font-medium">{course?.modules.reduce((total, module) => total + module.subsections.length, 0)}</span> lessons
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">{course?.modules.filter(module => module.quiz && module.quiz.questions.length > 0).length}</span> quizzes
                          </div>
                          {course?.duration > 0 && (
                            <div>
                              <span className="font-medium">{course.duration} hours</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {course?.modules.map((module, index) => (
                            <div key={index} className="text-sm">
                              <div className="font-medium text-foreground flex items-center">
                                <BookOpen className="h-3 w-3 mr-2" />
                                Module {index + 1}: {module.title || 'Untitled Module'}
                              </div>
                              <div className="ml-5 text-muted-foreground space-y-1">
                                <div>
                                  {module.subsections.length} lesson{module.subsections.length !== 1 ? 's' : ''}
                                </div>
                                {module.quiz && (
                                  <div className="flex items-center text-xs">
                                    <Brain className="h-2 w-2 mr-1" />
                                    Quiz ({module.quiz.questions.length} questions)
                                  </div>
                                )}
                                {module.subsections.length > 0 && (
                                  <div className="ml-2 space-y-1">
                                    {module.subsections.map((subsection, subIndex) => (
                                      <div key={subIndex} className="text-xs flex items-center">
                                        <Video className="h-2 w-2 mr-1" />
                                        {subsection.title || `Lesson ${subIndex + 1}`}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {course?.modules.length === 0 && (
                            <div className="text-muted-foreground text-sm">
                              No modules added yet
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <Separator />
                  {/* Materials preview is commented out */}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      <QuizModal
  open={quizModal.open}
  onClose={() => setQuizModal({ open: false, moduleIdx: null })}
  quiz={
    quizModal.moduleIdx !== null
      ? quizToModalFormat(course?.modules[quizModal.moduleIdx].quiz)
      : undefined
  }
  onSave={(modalQuiz: ModalQuizDto) => {
    if (quizModal.moduleIdx !== null) {
      const newModules = [...course.modules];
      newModules[quizModal.moduleIdx].quiz = modalToQuizFormat(modalQuiz);
      setCourse({ ...course, modules: newModules });
    }
  }}
/>
    
    </div>
                  );
                };
export default UploadCourse;