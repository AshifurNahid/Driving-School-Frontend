
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Plus, Trash2, GripVertical, FileText } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string;
  subsections: Subsection[];
  order: number;
}

interface Subsection {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
  order: number;
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  category: string;
  submittedAt: string;
  status: string;
  description?: string;
  price?: number;
  duration?: string;
  thumbnail?: string;
  featured?: boolean;
  published?: boolean;
  modules?: Module[];
  downloadableMaterials?: string[];
  tags?: string[];
}

const CourseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');

  // Mock course data - in real app, this would come from API
  const [course, setCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    instructor: '',
    category: '',
    description: '',
    price: 0,
    duration: '',
    status: 'pending',
    thumbnail: '',
    featured: false,
    published: false,
    tags: [] as string[],
    downloadableMaterials: [] as string[]
  });
  const [modules, setModules] = useState<Module[]>([]);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  // Mock data for the course
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCourse: Course = {
        id: parseInt(id || '1'),
        title: "Advanced React Patterns",
        instructor: "John Doe",
        category: "Web Development",
        submittedAt: "2024-01-15",
        status: "pending",
        description: "Learn advanced React patterns and best practices",
        price: 99.99,
        duration: "8 weeks",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
        featured: false,
        published: false,
        modules: [
          {
            id: "1",
            title: "Introduction to React Patterns",
            description: "Basic concepts and setup",
            order: 1,
            subsections: [
              {
                id: "1-1",
                title: "Getting Started",
                videoUrl: "https://example.com/video1",
                duration: "15 min",
                order: 1
              }
            ]
          }
        ],
        downloadableMaterials: ["https://example.com/react-guide.pdf"],
        tags: ["react", "javascript", "patterns"]
      };

      setCourse(mockCourse);
      setFormData({
        title: mockCourse.title || '',
        instructor: mockCourse.instructor || '',
        category: mockCourse.category || '',
        description: mockCourse.description || '',
        price: mockCourse.price || 0,
        duration: mockCourse.duration || '',
        status: mockCourse.status || 'pending',
        thumbnail: mockCourse.thumbnail || '',
        featured: mockCourse.featured || false,
        published: mockCourse.published || false,
        tags: mockCourse.tags || [],
        downloadableMaterials: mockCourse.downloadableMaterials || []
      });
      setModules(mockCourse.modules || []);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleSave = () => {
    // In real app, this would save to API
    
    toast({
      title: "Course updated",
      description: "Course has been successfully updated.",
    });
    
    navigate('/dashboard');
  };

  const handleInputChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addModule = () => {
    if (!newModuleTitle.trim()) return;
    
    const newModule: Module = {
      id: Date.now().toString(),
      title: newModuleTitle,
      description: '',
      subsections: [],
      order: modules.length + 1
    };
    
    setModules(prev => [...prev, newModule]);
    setNewModuleTitle('');
  };

  const removeModule = (moduleId: string) => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
  };

  const updateModule = (moduleId: string, updates: Partial<Module>) => {
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, ...updates } : m));
  };

  const addSubsection = (moduleId: string) => {
    const newSubsection: Subsection = {
      id: Date.now().toString(),
      title: 'New Subsection',
      videoUrl: '',
      duration: '',
      order: 1
    };

    setModules(prev => prev.map(m => 
      m.id === moduleId 
        ? { ...m, subsections: [...m.subsections, newSubsection] }
        : m
    ));
  };

  const removeSubsection = (moduleId: string, subsectionId: string) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId 
        ? { ...m, subsections: m.subsections.filter(s => s.id !== subsectionId) }
        : m
    ));
  };

  const updateSubsection = (moduleId: string, subsectionId: string, updates: Partial<Subsection>) => {
    setModules(prev => prev.map(m => 
      m.id === moduleId 
        ? { 
            ...m, 
            subsections: m.subsections.map(s => 
              s.id === subsectionId ? { ...s, ...updates } : s
            )
          }
        : m
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading course?...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Course Not Found</h1>
          <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/admin')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Edit Course</h1>
              <p className="text-muted-foreground mt-1">{course?.title}</p>
            </div>
          </div>
          <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="content">Content & Modules</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
                <CardDescription>Basic details about your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input
                      id="instructor"
                      value={formData.instructor}
                      onChange={(e) => handleInputChange('instructor', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="Data Science">Data Science</SelectItem>
                        <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="e.g. 8 weeks"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Thumbnail URL</Label>
                    <Input
                      id="thumbnail"
                      value={formData.thumbnail}
                      onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Course description..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Course Modules</CardTitle>
                    <CardDescription>Organize your course content into modules</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="New module title"
                      value={newModuleTitle}
                      onChange={(e) => setNewModuleTitle(e.target.value)}
                      className="w-64"
                    />
                    <Button onClick={addModule}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Module
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {modules.map((module, moduleIndex) => (
                  <Card key={module.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <CardTitle className="text-base">Module {moduleIndex + 1}</CardTitle>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeModule(module.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Module Title</Label>
                          <Input
                            value={module.title}
                            onChange={(e) => updateModule(module.id, { title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Module Description</Label>
                          <Input
                            value={module.description}
                            onChange={(e) => updateModule(module.id, { description: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">Subsections</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addSubsection(module.id)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Subsection
                          </Button>
                        </div>
                        
                        {module.subsections.map((subsection, subIndex) => (
                          <div key={subsection.id} className="border rounded-lg p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Subsection {subIndex + 1}</span>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeSubsection(module.id, subsection.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <Input
                                placeholder="Subsection title"
                                value={subsection.title}
                                onChange={(e) => updateSubsection(module.id, subsection.id, { title: e.target.value })}
                              />
                              <Input
                                placeholder="Video URL"
                                value={subsection.videoUrl}
                                onChange={(e) => updateSubsection(module.id, subsection.id, { videoUrl: e.target.value })}
                              />
                              <Input
                                placeholder="Duration"
                                value={subsection.duration}
                                onChange={(e) => updateSubsection(module.id, subsection.id, { duration: e.target.value })}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Course Materials
                </CardTitle>
                <CardDescription>Additional resources and tags for your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Downloadable Materials (one URL per line)</Label>
                  <Textarea
                    placeholder="https://example.com/material1.pdf&#10;https://example.com/slides.pptx"
                    value={formData.downloadableMaterials.join('\n')}
                    onChange={(e) => handleInputChange('downloadableMaterials', e.target.value.split('\n').filter(url => url.trim()))}
                    rows={5}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tags (comma separated)</Label>
                  <Input
                    placeholder="react, javascript, web development"
                    value={formData.tags.join(', ')}
                    onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
                <CardDescription>Manage course status and visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Review Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="published">Published</Label>
                      <p className="text-sm text-muted-foreground">Make this course visible to students</p>
                    </div>
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => handleInputChange('published', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="featured">Featured Course</Label>
                      <p className="text-sm text-muted-foreground">Highlight this course on the homepage</p>
                    </div>
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CourseEdit;
