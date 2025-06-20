
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, Trophy, Clock, Search, Filter, TrendingUp, BarChart3 } from 'lucide-react';

interface UserProgress {
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseName: string;
  enrolledDate: string;
  progress: number;
  completedModules: number;
  totalModules: number;
  lastActivity: string;
  timeSpent: number;
  status: 'not-started' | 'in-progress' | 'completed';
}

interface QuizPerformance {
  userId: string;
  userName: string;
  userEmail: string;
  quizId: string;
  quizTitle: string;
  courseId: string;
  courseName: string;
  score: number;
  passed: boolean;
  attempts: number;
  timeSpent: number;
  completedAt: string;
}

interface CourseStats {
  courseId: string;
  courseName: string;
  totalEnrolled: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  averageProgress: number;
  averageTimeSpent: number;
  completionRate: number;
}

const UserAnalytics: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data - in a real app, this would come from an API
  const userProgress: UserProgress[] = [
    {
      userId: '1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      courseId: '1',
      courseName: 'Advanced React Patterns',
      enrolledDate: '2024-01-10',
      progress: 85,
      completedModules: 8,
      totalModules: 10,
      lastActivity: '2024-01-20',
      timeSpent: 240,
      status: 'in-progress'
    },
    {
      userId: '2',
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      courseId: '1',
      courseName: 'Advanced React Patterns',
      enrolledDate: '2024-01-08',
      progress: 100,
      completedModules: 10,
      totalModules: 10,
      lastActivity: '2024-01-18',
      timeSpent: 320,
      status: 'completed'
    },
    {
      userId: '3',
      userName: 'Mike Johnson',
      userEmail: 'mike@example.com',
      courseId: '2',
      courseName: 'Machine Learning Basics',
      enrolledDate: '2024-01-15',
      progress: 35,
      completedModules: 3,
      totalModules: 8,
      lastActivity: '2024-01-22',
      timeSpent: 120,
      status: 'in-progress'
    }
  ];

  const quizPerformance: QuizPerformance[] = [
    {
      userId: '1',
      userName: 'John Doe',
      userEmail: 'john@example.com',
      quizId: '1',
      quizTitle: 'React Fundamentals Quiz',
      courseId: '1',
      courseName: 'Advanced React Patterns',
      score: 85,
      passed: true,
      attempts: 1,
      timeSpent: 25,
      completedAt: '2024-01-16T10:30:00Z'
    },
    {
      userId: '2',
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      quizId: '1',
      quizTitle: 'React Fundamentals Quiz',
      courseId: '1',
      courseName: 'Advanced React Patterns',
      score: 92,
      passed: true,
      attempts: 1,
      timeSpent: 22,
      completedAt: '2024-01-14T14:15:00Z'
    },
    {
      userId: '3',
      userName: 'Mike Johnson',
      userEmail: 'mike@example.com',
      quizId: '2',
      quizTitle: 'Machine Learning Concepts',
      courseId: '2',
      courseName: 'Machine Learning Basics',
      score: 65,
      passed: false,
      attempts: 2,
      timeSpent: 45,
      completedAt: '2024-01-20T16:45:00Z'
    }
  ];

  const courseStats: CourseStats[] = [
    {
      courseId: '1',
      courseName: 'Advanced React Patterns',
      totalEnrolled: 145,
      completed: 89,
      inProgress: 42,
      notStarted: 14,
      averageProgress: 78,
      averageTimeSpent: 280,
      completionRate: 61.4
    },
    {
      courseId: '2',
      courseName: 'Machine Learning Basics',
      totalEnrolled: 98,
      completed: 32,
      inProgress: 55,
      notStarted: 11,
      averageProgress: 65,
      averageTimeSpent: 320,
      completionRate: 32.7
    }
  ];

  const filteredProgress = userProgress.filter(progress => {
    const matchesCourse = selectedCourse === 'all' || progress.courseId === selectedCourse;
    const matchesSearch = progress.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         progress.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || progress.status === statusFilter;
    return matchesCourse && matchesSearch && matchesStatus;
  });

  const filteredQuizPerformance = quizPerformance.filter(quiz => {
    const matchesCourse = selectedCourse === 'all' || quiz.courseId === selectedCourse;
    const matchesSearch = quiz.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="bg-blue-600">In Progress</Badge>;
      case 'not-started':
        return <Badge variant="outline">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Analytics & Progress Tracking</h2>
      </div>

      {/* Course Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courseStats.reduce((sum, course) => sum + course.totalEnrolled, 0)}</div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Completion</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(courseStats.reduce((sum, course) => sum + course.completionRate, 0) / courseStats.length)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Platform-wide completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(courseStats.reduce((sum, course) => sum + course.averageTimeSpent, 0) / courseStats.length)} min
            </div>
            <p className="text-xs text-muted-foreground">
              Per course completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium">Search Users</label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="min-w-[180px]">
              <label className="text-sm font-medium">Course</label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courseStats.map(course => (
                    <SelectItem key={course.courseId} value={course.courseId}>
                      {course.courseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[140px]">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="course-stats" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="course-stats">Course Statistics</TabsTrigger>
          <TabsTrigger value="user-progress">User Progress</TabsTrigger>
          <TabsTrigger value="quiz-performance">Quiz Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="course-stats" className="space-y-4">
          <div className="grid gap-4">
            {courseStats.map((course) => (
              <Card key={course.courseId}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{course.courseName}</CardTitle>
                      <CardDescription>
                        {course.totalEnrolled} total enrollments
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {course.completionRate}% completion rate
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{course.completed}</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{course.inProgress}</div>
                      <div className="text-sm text-muted-foreground">In Progress</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">{course.notStarted}</div>
                      <div className="text-sm text-muted-foreground">Not Started</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{course.averageTimeSpent} min</div>
                      <div className="text-sm text-muted-foreground">Avg. Time</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Progress</span>
                      <span>{course.averageProgress}%</span>
                    </div>
                    <Progress value={course.averageProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="user-progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Progress ({filteredProgress.length} users)</CardTitle>
              <CardDescription>
                Track individual user progress across courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Modules</TableHead>
                    <TableHead>Time Spent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProgress.map((progress) => (
                    <TableRow key={`${progress.userId}-${progress.courseId}`}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{progress.userName}</div>
                          <div className="text-sm text-muted-foreground">{progress.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{progress.courseName}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{progress.progress}%</div>
                          <Progress value={progress.progress} className="h-1 w-16" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {progress.completedModules}/{progress.totalModules}
                      </TableCell>
                      <TableCell>{progress.timeSpent} min</TableCell>
                      <TableCell>{getStatusBadge(progress.status)}</TableCell>
                      <TableCell>{new Date(progress.lastActivity).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz-performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Performance ({filteredQuizPerformance.length} attempts)</CardTitle>
              <CardDescription>
                Detailed quiz results and performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Quiz</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attempts</TableHead>
                    <TableHead>Time Spent</TableHead>
                    <TableHead>Completed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuizPerformance.map((quiz, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{quiz.userName}</div>
                          <div className="text-sm text-muted-foreground">{quiz.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{quiz.quizTitle}</TableCell>
                      <TableCell>{quiz.courseName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={quiz.score >= 70 ? 'text-green-600' : 'text-red-600'}>
                            {quiz.score}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={quiz.passed ? "default" : "destructive"}>
                          {quiz.passed ? "Passed" : "Failed"}
                        </Badge>
                      </TableCell>
                      <TableCell>{quiz.attempts}</TableCell>
                      <TableCell>{quiz.timeSpent} min</TableCell>
                      <TableCell>{new Date(quiz.completedAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserAnalytics;
