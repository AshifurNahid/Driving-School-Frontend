import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

export function QuizModal({ open, onClose, quiz, onSave }) {
  const [localQuiz, setLocalQuiz] = useState(quiz || {
    title: "",
    description: "",
    passing_score: 70,
    max_attempts: 1,
    questions: [],
  });

  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);

  useEffect(() => {
    setLocalQuiz(
      quiz || {
        title: "",
        description: "",
        passing_score: 70,
        max_attempts: 1,
        questions: [],
      }
    );
    setExpandedQuestions([]);
  }, [quiz, open]);

  const addQuestion = () => {
    setLocalQuiz((q) => ({
      ...q,
      questions: [
        ...q.questions,
        {
          question: "",
          type: 0,
          options: "",
          correct_answers: "",
          points: 1,
          // order_index: q.questions.length + 1,
        },
      ],
    }));
    setExpandedQuestions((prev) => [...prev, localQuiz.questions.length]);
  };

  const updateQuestion = (idx, field, value) => {
    const questions = [...localQuiz.questions];
    questions[idx][field] = value;
    setLocalQuiz((q) => ({ ...q, questions }));
  };

  const removeQuestion = (idx) => {
    setLocalQuiz((q) => ({
      ...q,
      questions: q.questions.filter((_, i) => i !== idx),
    }));
    setExpandedQuestions((prev) => prev.filter((i) => i !== idx));
  };

  const toggleExpand = (idx: number) => {
    setExpandedQuestions((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Quiz</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <Input
            placeholder="Quiz Title"
            value={localQuiz.title}
            onChange={(e) => setLocalQuiz((q) => ({ ...q, title: e.target.value }))}
          />
          <Textarea
            placeholder="Quiz Description"
            value={localQuiz.description}
            onChange={(e) => setLocalQuiz((q) => ({ ...q, description: e.target.value }))}
          />
          <div className="flex gap-4">
            <Input
              type="number"
              min={1}
              max={100}
              value={localQuiz.passing_score}
              onChange={(e) => setLocalQuiz((q) => ({ ...q, passing_score: parseInt(e.target.value) || 0 }))}
              placeholder="Passing Score (%)"
              className="w-40"
            />
            <Input
              type="number"
              min={1}
              value={localQuiz.max_attempts}
              onChange={(e) => setLocalQuiz((q) => ({ ...q, max_attempts: parseInt(e.target.value) || 1 }))}
              placeholder="Max Attempts"
              className="w-40"
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Questions</span>
            <Button size="sm" onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-1" /> Add Question
            </Button>
          </div>
          {localQuiz.questions.map((q, idx) => (
            <div key={idx} className="border rounded mb-2">
              <div
                className="flex items-center justify-between px-2 py-2 cursor-pointer bg-muted"
                onClick={() => toggleExpand(idx)}
              >
                <div className="flex items-center gap-2">
                  {expandedQuestions.includes(idx) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <span className="font-medium">Question {idx + 1}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {q.type === 0
                      ? "Multiple Choice"
                      : q.type === 1
                      ? "Single Choice"
                      : "Short Answer"}
                  </span>
                </div>
                <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); removeQuestion(idx); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {expandedQuestions.includes(idx) && (
                <div className="p-2 space-y-2">
                  <div className="flex gap-2 items-center">
                    <Select
                      value={q.type.toString()}
                      onValueChange={(value) => updateQuestion(idx, "type", parseInt(value))}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Multiple Choice</SelectItem>
                        <SelectItem value="1">Single Choice</SelectItem>
                        <SelectItem value="2">Short Answer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      
                      className="w-24"
                      value={q.points}
                      onChange={(e) => updateQuestion(idx, "points", parseInt(e.target.value) || 1)}
                      placeholder="Points"
                    />
                    {/* <Input
                      type="number"
                      
                      className="w-24"
                      value={q.order_index}
                      onChange={(e) => updateQuestion(idx, "order_index", parseInt(e.target.value) || idx + 1)}
                      placeholder="Order Index"
                    /> */}
                  </div>
                  <Input
                    placeholder="Question"
                    value={q.question}
                    onChange={(e) => updateQuestion(idx, "question", e.target.value)}
                  />
                  <Input
                    placeholder='Options (comma separated, e.g. "A. Yield,B. Stop,C. No Entry,D. Speed Limit")'
                    value={q.options}
                    onChange={(e) => updateQuestion(idx, "options", e.target.value)}
                  />
                  <Input
                    placeholder='Correct Answer (e.g. "B" for Single/Multiple Choice, or text for Short Answer)'
                    value={q.correct_answers}
                    onChange={(e) => updateQuestion(idx, "correct_answers", e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave({
                title: localQuiz.title,
                description: localQuiz.description,
                passing_score: localQuiz.passing_score,
                max_attempts: localQuiz.max_attempts,
                questions: localQuiz.questions,
              });
              onClose();
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}