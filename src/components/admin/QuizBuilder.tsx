
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

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
  id?: string;
  title: string;
  description: string;
  moduleId: string;
  questions: Question[];
  passPercentage: number;
  timeLimit?: number;
  allowRetakes: boolean;
}

interface QuizBuilderProps {
  modules: Array<{ id: string; title: string }>;
  quiz?: Quiz;
  onSave: (quiz: Quiz) => void;
  onCancel: () => void;
}

const QuizBuilder: React.FC<QuizBuilderProps> = ({ modules, quiz, onSave, onCancel }) => {
  const [quizData, setQuizData] = useState<Quiz>(quiz || {
    title: '',
    description: '',
    moduleId: '',
    questions: [],
    passPercentage: 70,
    allowRetakes: true
  });

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    };
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => i === index ? { ...q, ...updates } : q)
    }));
  };

  const removeQuestion = (index: number) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { ...q, options: q.options?.map((opt, oi) => oi === optionIndex ? value : opt) }
          : q
      )
    }));
  };

  const renderQuestionEditor = (question: Question, index: number) => {
    return (
      <Card key={question.id} className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Question {index + 1}</CardTitle>
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => removeQuestion(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Question Type</label>
              <Select 
                value={question.type} 
                onValueChange={(value: 'mcq' | 'true-false' | 'short-answer') => 
                  updateQuestion(index, { 
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
            </div>
            <div>
              <label className="text-sm font-medium">Points</label>
              <Input 
                type="number" 
                value={question.points}
                onChange={(e) => updateQuestion(index, { points: parseInt(e.target.value) || 1 })}
                min="1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Question</label>
            <Textarea 
              value={question.question}
              onChange={(e) => updateQuestion(index, { question: e.target.value })}
              placeholder="Enter your question here..."
            />
          </div>

          {question.type === 'mcq' && (
            <div>
              <label className="text-sm font-medium">Answer Options</label>
              <div className="space-y-2 mt-2">
                {question.options?.map((option, optIndex) => (
                  <div key={optIndex} className="flex items-center gap-2">
                    <RadioGroup 
                      value={question.correctAnswer as string}
                      onValueChange={(value) => updateQuestion(index, { correctAnswer: value })}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={optIndex.toString()} id={`q${index}-opt${optIndex}`} />
                      </div>
                    </RadioGroup>
                    <Input 
                      value={option}
                      onChange={(e) => updateOption(index, optIndex, e.target.value)}
                      placeholder={`Option ${optIndex + 1}`}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {question.type === 'true-false' && (
            <div>
              <label className="text-sm font-medium">Correct Answer</label>
              <RadioGroup 
                value={question.correctAnswer?.toString()}
                onValueChange={(value) => updateQuestion(index, { correctAnswer: value === 'true' })}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id={`q${index}-true`} />
                  <label htmlFor={`q${index}-true`}>True</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id={`q${index}-false`} />
                  <label htmlFor={`q${index}-false`}>False</label>
                </div>
              </RadioGroup>
            </div>
          )}

          {question.type === 'short-answer' && (
            <div>
              <label className="text-sm font-medium">Sample Correct Answer</label>
              <Input 
                value={question.correctAnswer as string}
                onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value })}
                placeholder="Enter a sample correct answer for reference"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Explanation (Optional)</label>
            <Textarea 
              value={question.explanation || ''}
              onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
              placeholder="Explain why this is the correct answer..."
            />
          </div>
        </CardContent>
      </Card>
    );
  };

  const handleSave = () => {
    if (!quizData.title || !quizData.moduleId || quizData.questions.length === 0) {
      alert('Please fill in all required fields and add at least one question.');
      return;
    }
    onSave(quizData);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quiz Settings</CardTitle>
          <CardDescription>Configure basic quiz settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Quiz Title</label>
              <Input 
                value={quizData.title}
                onChange={(e) => setQuizData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter quiz title"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Module</label>
              <Select 
                value={quizData.moduleId}
                onValueChange={(value) => setQuizData(prev => ({ ...prev, moduleId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select module" />
                </SelectTrigger>
                <SelectContent>
                  {modules.map(module => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              value={quizData.description}
              onChange={(e) => setQuizData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter quiz description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Pass Percentage</label>
              <Input 
                type="number"
                value={quizData.passPercentage}
                onChange={(e) => setQuizData(prev => ({ ...prev, passPercentage: parseInt(e.target.value) || 70 }))}
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Time Limit (minutes)</label>
              <Input 
                type="number"
                value={quizData.timeLimit || ''}
                onChange={(e) => setQuizData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || undefined }))}
                placeholder="No limit"
              />
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <Switch 
                checked={quizData.allowRetakes}
                onCheckedChange={(checked) => setQuizData(prev => ({ ...prev, allowRetakes: checked }))}
              />
              <label className="text-sm font-medium">Allow Retakes</label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Questions ({quizData.questions.length})</h3>
        <Button onClick={addQuestion}>
          <Plus className="h-4 w-4 mr-2" />
          Add Question
        </Button>
      </div>

      {quizData.questions.map((question, index) => renderQuestionEditor(question, index))}

      <div className="flex justify-end gap-2 pt-6 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizBuilder;
