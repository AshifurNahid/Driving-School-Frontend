import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Eye, Play, ChevronDown, ChevronRight, BookOpen, Video, Brain, HelpCircle, Car, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ThemeToggle } from '@/components/ThemeToggle';
import PhysicalCourseForm from '@/components/course/PhysicalCourseForm';

type CourseType = 'online' | 'physical';

interface Subsection {
  title: string;
  videoUrl: string;
}

interface Question {
  id: string;
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
  allowRetakes: boolean;
}

interface Module {
  title: string;
  description: string;
  subsections: Subsection[];
  quiz?: Quiz;
  isExpanded: boolean;
  isQuizExpanded: boolean;
}

interface PhysicalCourseData {
  title: string;
  price: number;
  duration: string;
  includes: string;
  description: string;
  location: string;
}

interface Course {
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  price: number;
  courseType: CourseType;
  modules: Module[];
  physicalCourseData?: PhysicalCourseData;
}

const UploadCourse = () => {
  const [course, setCourse] = useState<Course>({
    title: '',
    description: '',
    category: '',
    thumbnail: '',
    price: 0,
    courseType: 'online',
    modules: [],
    physicalCourseData: {
      title: '',
      price: 0,
      duration: '',
      includes: '',
      description: '',
      location: ''
    }
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const handleCourseTypeChange = (type: CourseType) => {
    setCourse(prev => ({
      ...prev,
      courseType: type,
      // Clear modules if switching to physical
      modules: type === 'physical' ? [] : prev.modules
    }));
  };

  const handlePhysicalCourseDataChange = (field: keyof PhysicalCourseData, value: string | number) => {
    setCourse(prev => ({
      ...prev,
      physicalCourseData: {
        ...prev.physicalCourseData!,
        [field]: value
      }
    }));
  };

  const addModule = () => {
    setCourse({
      ...course,
      modules: [
        ...course.modules,
        { title: '', description: '', subsections: [], isExpanded: true, isQuizExpanded: false },
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
    updateModule(moduleIndex, 'isExpanded', !course.modules[moduleIndex].isExpanded);
  };

  const toggleQuizExpansion = (moduleIndex: number) => {
    updateModule(moduleIndex, 'isQuizExpanded', !course.modules[moduleIndex].isQuizExpanded);
  };

  const addQuizToModule = (moduleIndex: number) => {
    const newModules = [...course.modules];
    newModules[moduleIndex].quiz = {
      title: '',
      description: '',
      questions: [],
      passPercentage: 70,
      allowRetakes: true
    };
    newModules[moduleIndex].isQuizExpanded = true;
    setCourse({ ...course, modules: newModules });
  };

  const removeQuizFromModule = (moduleIndex: number) => {
    const newModules = [...course.modules];
    delete newModules[moduleIndex].quiz;
    newModules[moduleIndex].isQuizExpanded = false;
    setCourse({ ...course, modules: newModules });
  };

  const updateQuiz = (moduleIndex: number, field: string, value: any) => {
    const newModules = [...course.modules];
    if (newModules[moduleIndex].quiz) {
      newModules[moduleIndex].quiz = { ...newModules[moduleIndex].quiz!, [field]: value };
      setCourse({ ...course, modules: newModules });
    }
  };

  const addQuestionToQuiz = (moduleIndex: number) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    };
    const newModules = [...course.modules];
    if (newModules[moduleIndex].quiz) {
      newModules[moduleIndex].quiz!.questions = [...newModules[moduleIndex].quiz!.questions, newQuestion];
      setCourse({ ...course, modules: newModules });
    }
  };

  const removeQuestionFromQuiz = (moduleIndex: number, questionIndex: number) => {
    const newModules = [...course.modules];
    if (newModules[moduleIndex].quiz) {
      newModules[moduleIndex].quiz!.questions.splice(questionIndex, 1);
      setCourse({ ...course, modules: newModules });
    }
  };

  const updateQuestion = (moduleIndex: number, questionIndex: number, updates: Partial<Question>) => {
    const newModules = [...course.modules];
    if (newModules[moduleIndex].quiz) {
      newModules[moduleIndex].quiz!.questions[questionIndex] = {
        ...newModules[moduleIndex].quiz!.questions[questionIndex],
        ...updates
      };
      setCourse({ ...course, modules: newModules });
    }
  };

  const updateQuestionOption = (moduleIndex: number, questionIndex: number, optionIndex: number, value: string) => {
    const newModules = [...course.modules];
    if (newModules[moduleIndex].quiz) {
      const question = newModules[moduleIndex].quiz!.questions[questionIndex];
      if (question.options) {
        question.options[optionIndex] = value;
        setCourse({ ...course, modules: newModules });
      }
    }
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

  const handleSubmit = () => {
    console.log('Course data:', course);
    // Implementation for course submission would go here
  };

  const getTotalSubsections = () => {
    return course.modules.reduce((total, module) => total + module.subsections.length, 0);
  };

  const getTotalQuizzes = () => {
    return course.modules.filter(module => module.quiz && module.quiz.questions.length > 0).length;
  };

  const getEstimatedDuration = () => {
    if (course.courseType === 'physical') {
      return course.physicalCourseData?.duration || 'TBD';
    }
    const subsectionCount = getTotalSubsections();
    return `${Math.ceil(subsectionCount * 1.5)} hours`;
  };

  const renderQuestionEditor = (moduleIndex: number, question: Question, questionIndex: number) => {
    return (
      <Card key={question.id} className="mb-3 bg-background/50">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <Badge variant="outline" className="text-xs">
              Question {questionIndex + 1}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeQuestionFromQuiz(moduleIndex, questionIndex)}
              className="text-red-600 hover:text-red-700 -mt-1 -mr-1"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <Select 
              value={question.type} 
              onValueChange={(value: 'mcq' | 'true-false' | 'short-answer') => 
                updateQuestion(moduleIndex, questionIndex, { 
                  type: value,
                  options: value === 'mcq' ? ['', '', '', ''] : value === 'true-false' ? ['True', 'False'] : undefined,
                  correctAnswer: value === 'true-false' ? true : ''
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mcq">Multiple Choice</SelectItem>
                <SelectItem value="true-false">True/False</SelectItem>
                <SelectItem value="short-answer">Short Answer</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              type="number" 
              value={question.points}
              onChange={(e) => updateQuestion(moduleIndex, questionIndex, { points: parseInt(e.target.value) || 1 })}
              placeholder="Points"
              min="1"
            />
          </div>

          <Textarea 
            value={question.question}
            onChange={(e) => updateQuestion(moduleIndex, questionIndex, { question: e.target.value })}
            placeholder="Enter your question here..."
            className="mb-3"
          />

          {question.type === 'mcq' && (
            <div className="space-y-2 mb-3">
              {question.options?.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
                  <RadioGroup 
                    value={question.correctAnswer as string}
                    onValueChange={(value) => updateQuestion(moduleIndex, questionIndex, { correctAnswer: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={optIndex.toString()} id={`q${questionIndex}-opt${optIndex}`} />
                    </div>
                  </RadioGroup>
                  <Input 
                    value={option}
                    onChange={(e) => updateQuestionOption(moduleIndex, questionIndex, optIndex, e.target.value)}
                    placeholder={`Option ${optIndex + 1}`}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          )}

          {question.type === 'true-false' && (
            <RadioGroup 
              value={question.correctAnswer?.toString()}
              onValueChange={(value) => updateQuestion(moduleIndex, questionIndex, { correctAnswer: value === 'true' })}
              className="flex gap-4 mb-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id={`q${questionIndex}-true`} />
                <label htmlFor={`q${questionIndex}-true`}>True</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id={`q${questionIndex}-false`} />
                <label htmlFor={`q${questionIndex}-false`}>False</label>
              </div>
            </RadioGroup>
          )}

          {question.type === 'short-answer' && (
            <Input 
              value={question.correctAnswer as string}
              onChange={(e) => updateQuestion(moduleIndex, questionIndex, { correctAnswer: e.target.value })}
              placeholder="Sample correct answer"
              className="mb-3"
            />
          )}

          <Textarea 
            value={question.explanation || ''}
            onChange={(e) => updateQuestion(moduleIndex, questionIndex, { explanation: e.target.value })}
            placeholder="Explanation (optional)"
            rows={2}
          />
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                EduPlatform
              </Link>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create New Course</h1>
          <p className="text-muted-foreground mt-2">Build your driving course - choose between online or physical instruction</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Course Type</CardTitle>
                <CardDescription>Choose the type of driving course you want to create</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={course.courseType} 
                  onValueChange={(value) => handleCourseTypeChange(value as CourseType)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Basic Information */}
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
                    value={course.title}
                    onChange={(e) => setCourse({ ...course, title: e.target.value })}
                    placeholder={course.courseType === 'physical' ? "e.g., Test Prep Package" : "e.g., Complete Online Driver's Ed"}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Course Description</Label>
                  <Textarea
                    id="description"
                    value={course.description}
                    onChange={(e) => setCourse({ ...course, description: e.target.value })}
                    placeholder={course.courseType === 'physical' 
                      ? "Describe the benefits and preparation this physical course provides..."
                      : "Describe what students will learn in this online course..."
                    }
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={course.category} onValueChange={(value) => setCourse({ ...course, category: value })}>
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
                      value={course.price}
                      onChange={(e) => setCourse({ ...course, price: parseFloat(e.target.value) || 0 })}
                      placeholder={course.courseType === 'physical' ? "550" : "99.99"}
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Thumbnail Image URL</Label>
                    <Input
                      id="thumbnail"
                      value={course.thumbnail}
                      onChange={(e) => setCourse({ ...course, thumbnail: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Physical Course Form or Online Course Content */}
            {course.courseType === 'physical' ? (
              <PhysicalCourseForm 
                data={course.physicalCourseData!}
                onChange={handlePhysicalCourseDataChange}
              />
            ) : (
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
                  {course.modules.map((module, moduleIndex) => (
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
                                        value={subsection.videoUrl}
                                        onChange={(e) => updateSubsection(moduleIndex, subsectionIndex, 'videoUrl', e.target.value)}
                                        placeholder="Video URL (YouTube, Vimeo, or direct link)"
                                        className="bg-background"
                                      />
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
                                {!module.quiz ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addQuizToModule(moduleIndex)}
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Quiz
                                  </Button>
                                ) : (
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleQuizExpansion(moduleIndex)}
                                    >
                                      {module.isQuizExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeQuizFromModule(moduleIndex)}
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>

                              {module.quiz && (
                                <Collapsible open={module.isQuizExpanded} onOpenChange={() => toggleQuizExpansion(moduleIndex)}>
                                  <CollapsibleContent>
                                    <Card className="bg-muted/20">
                                      <CardContent className="p-4 space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <Input
                                            value={module.quiz.title}
                                            onChange={(e) => updateQuiz(moduleIndex, 'title', e.target.value)}
                                            placeholder="Quiz title"
                                          />
                                          <Input
                                            type="number"
                                            value={module.quiz.passPercentage}
                                            onChange={(e) => updateQuiz(moduleIndex, 'passPercentage', parseInt(e.target.value) || 70)}
                                            placeholder="Pass percentage"
                                            min="0"
                                            max="100"
                                          />
                                        </div>

                                        <Textarea
                                          value={module.quiz.description}
                                          onChange={(e) => updateQuiz(moduleIndex, 'description', e.target.value)}
                                          placeholder="Quiz description"
                                          rows={2}
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                          <Input
                                            type="number"
                                            value={module.quiz.timeLimit || ''}
                                            onChange={(e) => updateQuiz(moduleIndex, 'timeLimit', parseInt(e.target.value) || undefined)}
                                            placeholder="Time limit (minutes)"
                                          />
                                          <div className="flex items-center space-x-2">
                                            <Switch
                                              checked={module.quiz.allowRetakes}
                                              onCheckedChange={(checked) => updateQuiz(moduleIndex, 'allowRetakes', checked)}
                                            />
                                            <Label>Allow Retakes</Label>
                                          </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                          <Label className="text-sm font-medium">Questions ({module.quiz.questions.length})</Label>
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => addQuestionToQuiz(moduleIndex)}
                                          >
                                            <Plus className="h-3 w-3 mr-1" />
                                            Add Question
                                          </Button>
                                        </div>

                                        {module.quiz.questions.map((question, questionIndex) =>
                                          renderQuestionEditor(moduleIndex, question, questionIndex)
                                        )}

                                        {module.quiz.questions.length === 0 && (
                                          <div className="text-center py-4 text-muted-foreground border border-dashed border-border rounded-lg">
                                            <HelpCircle className="h-6 w-6 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">No questions yet. Click "Add Question" to create your first quiz question.</p>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </CollapsibleContent>
                                </Collapsible>
                              )}

                              {!module.quiz && (
                                <div className="text-center py-6 text-muted-foreground border border-dashed border-border rounded-lg">
                                  <Brain className="h-6 w-6 mx-auto mb-2 opacity-50" />
                                  <p className="text-sm">No quiz for this module. Add a quiz to test students' understanding.</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                    </Card>
                  ))}

                  {course.modules.length === 0 && course.courseType === 'online' && (
                    <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-lg">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No modules yet</h3>
                      <p className="mb-4">Start building your online course by adding your first module.</p>
                      <Button onClick={addModule} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Module
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" asChild>
                <Link to="/dashboard">Cancel</Link>
              </Button>
              <div className="flex space-x-4">
                <Button variant="outline" onClick={handleSubmit}>
                  Save as Draft
                </Button>
                <Button onClick={handleSubmit} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Publish Course
                </Button>
              </div>
            </div>
          </div>

          {/* Course Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {course.courseType === 'physical' ? <Car className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                    Course Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt="Course thumbnail"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  )}
                  
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground text-lg">{course.title || 'Course Title'}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {course.description || 'Course description will appear here...'}
                      </p>
                    </div>
                    <Badge variant={course.courseType === 'physical' ? 'default' : 'secondary'} className="ml-2">
                      {course.courseType === 'physical' ? 'Physical' : 'Online'}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    {course.category && (
                      <Badge variant="outline">{course.category.replace('-', ' ')}</Badge>
                    )}
                    {course.price > 0 && (
                      <span className="text-lg font-bold text-blue-600">${course.price} CAD</span>
                    )}
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Course Content</h4>
                    
                    {course.courseType === 'physical' ? (
                      <div className="space-y-3">
                        <div className="text-sm text-muted-foreground">
                          <div className="flex justify-between">
                            <span>Duration:</span>
                            <span className="font-medium">{course.physicalCourseData?.duration || 'TBD'}</span>
                          </div>
                          {course.physicalCourseData?.location && (
                            <div className="flex justify-between">
                              <span>Location:</span>
                              <span className="font-medium">{course.physicalCourseData.location}</span>
                            </div>
                          )}
                        </div>
                        
                        {course.physicalCourseData?.includes && (
                          <div>
                            <h5 className="text-sm font-medium mb-2">What's Included:</h5>
                            <div className="space-y-1">
                              {course.physicalCourseData.includes.split('\n').filter(item => item.trim()).map((item, index) => (
                                <div key={index} className="text-xs text-muted-foreground flex items-center">
                                  <div className="h-1 w-1 bg-blue-600 rounded-full mr-2"></div>
                                  {item.trim()}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">{course.modules.length}</span> modules
                          </div>
                          <div>
                            <span className="font-medium">{getTotalSubsections()}</span> lessons
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">{getTotalQuizzes()}</span> quizzes
                          </div>
                          {getTotalSubsections() > 0 && (
                            <div>
                              <span className="font-medium">{getEstimatedDuration()}</span>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {course.modules.map((module, index) => (
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
                          {course.modules.length === 0 && (
                            <div className="text-muted-foreground text-sm">
                              No modules added yet
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCourse;
