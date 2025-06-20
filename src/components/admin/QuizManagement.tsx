
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Trash2, Plus, Users, BarChart3 } from 'lucide-react';
import QuizBuilder from './QuizBuilder';

interface Quiz {
  id: string;
  title: string;
  description: string;
  moduleId: string;
  moduleName: string;
  questions: number;
  passPercentage: number;
  attempts: number;
  averageScore: number;
  createdAt: string;
}

interface QuizResult {
  id: string;
  quizId: string;
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
  passed: boolean;
  completedAt: string;
  timeSpent: number;
}

interface QuizManagementProps {
  courses: Array<{
    id: string;
    title: string;
    modules: Array<{ id: string; title: string }>;
  }>;
}

const QuizManagement: React.FC<QuizManagementProps> = ({ courses }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: '1',
      title: 'React Fundamentals Quiz',
      description: 'Test your knowledge of React basics',
      moduleId: '1',
      moduleName: 'Introduction to React',
      questions: 10,
      passPercentage: 70,
      attempts: 45,
      averageScore: 78,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Machine Learning Concepts',
      description: 'Basic ML concepts and algorithms',
      moduleId: '2',
      moduleName: 'ML Fundamentals',
      questions: 15,
      passPercentage: 80,
      attempts: 32,
      averageScore: 85,
      createdAt: '2024-01-20'
    }
  ]);

  const [quizResults, setQuizResults] = useState<QuizResult[]>([
    {
      id: '1',
      quizId: '1',
      userId: '1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      score: 85,
      passed: true,
      completedAt: '2024-01-16T10:30:00Z',
      timeSpent: 25
    },
    {
      id: '2',
      quizId: '1',
      userId: '2',
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      score: 65,
      passed: false,
      completedAt: '2024-01-16T14:15:00Z',
      timeSpent: 30
    }
  ]);

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const allModules = courses.flatMap(course => 
    course.modules.map(module => ({
      id: module.id,
      title: `${course.title} - ${module.title}`
    }))
  );

  const handleSaveQuiz = (quizData: any) => {
    if (selectedQuiz) {
      setQuizzes(prev => prev.map(q => q.id === selectedQuiz.id ? { ...q, ...quizData } : q));
    } else {
      const newQuiz: Quiz = {
        ...quizData,
        id: Date.now().toString(),
        moduleName: allModules.find(m => m.id === quizData.moduleId)?.title || '',
        questions: quizData.questions.length,
        attempts: 0,
        averageScore: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setQuizzes(prev => [...prev, newQuiz]);
    }
    setShowBuilder(false);
    setSelectedQuiz(null);
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (confirm('Are you sure you want to delete this quiz?')) {
      setQuizzes(prev => prev.filter(q => q.id !== quizId));
    }
  };

  const getQuizResults = (quizId: string) => {
    return quizResults.filter(result => result.quizId === quizId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quiz Management</h2>
        <Button onClick={() => { setSelectedQuiz(null); setShowBuilder(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Create Quiz
        </Button>
      </div>

      {/* Quiz Builder Dialog */}
      <Dialog open={showBuilder} onOpenChange={setShowBuilder}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedQuiz ? 'Edit Quiz' : 'Create New Quiz'}</DialogTitle>
            <DialogDescription>
              {selectedQuiz ? 'Modify the quiz settings and questions' : 'Build a new quiz for your course modules'}
            </DialogDescription>
          </DialogHeader>
          <QuizBuilder
            modules={allModules}
            quiz={selectedQuiz ? {
              id: selectedQuiz.id,
              title: selectedQuiz.title,
              description: selectedQuiz.description,
              moduleId: selectedQuiz.moduleId,
              questions: [], // Would need to load actual questions
              passPercentage: selectedQuiz.passPercentage,
              allowRetakes: true
            } : undefined}
            onSave={handleSaveQuiz}
            onCancel={() => { setShowBuilder(false); setSelectedQuiz(null); }}
          />
        </DialogContent>
      </Dialog>

      {/* Quiz Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quiz Results - {selectedQuiz?.title}</DialogTitle>
            <DialogDescription>
              View detailed results and performance analytics
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{getQuizResults(selectedQuiz?.id || '').length}</div>
                  <div className="text-sm text-muted-foreground">Total Attempts</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {getQuizResults(selectedQuiz?.id || '').filter(r => r.passed).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {getQuizResults(selectedQuiz?.id || '').filter(r => !r.passed).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">{selectedQuiz?.averageScore}%</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </CardContent>
              </Card>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time Spent</TableHead>
                  <TableHead>Completed At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getQuizResults(selectedQuiz?.id || '').map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{result.userName}</div>
                        <div className="text-sm text-muted-foreground">{result.userEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>{result.score}%</TableCell>
                    <TableCell>
                      <Badge variant={result.passed ? "default" : "destructive"}>
                        {result.passed ? "Passed" : "Failed"}
                      </Badge>
                    </TableCell>
                    <TableCell>{result.timeSpent} min</TableCell>
                    <TableCell>{new Date(result.completedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quiz List */}
      <div className="grid gap-4">
        {quizzes.map((quiz) => (
          <Card key={quiz.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {quiz.title}
                    <Badge variant="outline">{quiz.questions} questions</Badge>
                  </CardTitle>
                  <CardDescription>
                    {quiz.description} • {quiz.moduleName}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => { setSelectedQuiz(quiz); setShowResults(true); }}
                  >
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Results
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => { setSelectedQuiz(quiz); setShowBuilder(true); }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium">Pass Rate</div>
                  <div className="text-muted-foreground">{quiz.passPercentage}%</div>
                </div>
                <div>
                  <div className="font-medium">Attempts</div>
                  <div className="text-muted-foreground">{quiz.attempts}</div>
                </div>
                <div>
                  <div className="font-medium">Average Score</div>
                  <div className="text-muted-foreground">{quiz.averageScore}%</div>
                </div>
                <div>
                  <div className="font-medium">Created</div>
                  <div className="text-muted-foreground">{quiz.createdAt}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {quizzes.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">No quizzes created yet</div>
            <Button 
              onClick={() => { setSelectedQuiz(null); setShowBuilder(true); }}
              className="mt-4"
            >
              Create Your First Quiz
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizManagement;
