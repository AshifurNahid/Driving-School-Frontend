import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

// Helper for default options
const defaultOptions = { a: '', b: '', c: '', d: '' };

export function QuizModal({ open, onClose, quiz, onSave }) {
  const [localQuiz, setLocalQuiz] = useState(quiz || {
    title: "",
    description: "",
    passing_score: "",
    max_attempts: "",
    questions: [],
  });

  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);

  useEffect(() => {
    if (quiz) {
      setLocalQuiz({
        title: quiz.title || "",
        description: quiz.description || "",
        passing_score: quiz.passing_score || "",
        max_attempts: quiz.max_attempts?.toString() || "",
        questions: quiz.questions || [],
      });
    } else {
      setLocalQuiz({
        title: "",
        description: "",
        passing_score: "",
        max_attempts: "",
        questions: [],
      });
    }
    setExpandedQuestions([]);
  }, [quiz, open]);

  // Parse options JSON or fallback to default
  const parseOptions = (optionsStr) => {
    try {
      const parsed = JSON.parse(optionsStr);
      return { ...defaultOptions, ...parsed };
    } catch {
      return { ...defaultOptions };
    }
  };

  // Add a new question
  const addQuestion = () => {
    setLocalQuiz((q) => ({
      ...q,
      questions: [
        ...q.questions,
        {
          question: "",
          type: 1, // 1 = Single Choice, 0 = Multiple Choice
          options: JSON.stringify(defaultOptions),
          correct_answers: "",
          points: 1,
        },
      ],
    }));
    setExpandedQuestions((prev) => [...prev, localQuiz.questions.length]);
  };
console.log(localQuiz.max_attempts);

  // Update a question field
  const updateQuestion = (idx, field, value) => {
    const questions = [...localQuiz.questions];
    if (field === 'options') {
      // value is { a, b, c, d }
      questions[idx].options = JSON.stringify(value);
    } else {
      questions[idx][field] = value;
    }
    setLocalQuiz((q) => ({ ...q, questions }));
  };

  // Remove a question
  const removeQuestion = (idx) => {
    setLocalQuiz((q) => ({
      ...q,
      questions: q.questions.filter((_, i) => i !== idx),
    }));
    setExpandedQuestions((prev) => prev.filter((i) => i !== idx));
  };

  // Toggle expand/collapse
  const toggleExpand = (idx: number) => {
    setExpandedQuestions((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Handle correct answer selection
  const handleCorrectAnswer = (idx, key, checked, type, prevCorrect) => {
    if (type === 1) {
      // Single choice: only one answer
      updateQuestion(idx, 'correct_answers', key);
    } else {
      // Multiple choice: toggle in array
      let arr = prevCorrect ? prevCorrect.split(',').filter(Boolean) : [];
      if (checked) {
        if (!arr.includes(key)) arr.push(key);
      } else {
        arr = arr.filter((k) => k !== key);
      }
      updateQuestion(idx, 'correct_answers', arr.join(','));
    }
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
              type="text"
              required={true}
              value={localQuiz.passing_score}
              onChange={(e) => setLocalQuiz((q) => ({ ...q, passing_score: e.target.value }))}
              placeholder="Passing Score (%)"
              className="w-40"
            />
            <Input
              type="text"
              required={true}
              value={localQuiz.max_attempts}
              onChange={(e) => setLocalQuiz((q) => ({ ...q, max_attempts: e.target.value}))}
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
          {localQuiz.questions.map((q, idx) => {
            // Always parse options as { a, b, c, d }
            const optionsObj = parseOptions(q.options);
            const correctArr = q.correct_answers ? q.correct_answers.split(',') : [];
            return (
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
                      {q.type === 0 ? "Multiple Choice" : "Single Choice"}
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
                        </SelectContent>
                      </Select>
                      <label htmlFor="points">Points</label>
                      <Input
                        type="number"
                        className="w-24"
                        value={q.points}
                        onChange={(e) => updateQuestion(idx, "points", parseInt(e.target.value) || 1)}
                        placeholder="Points"
                      />
                    </div>
                    <Input
                      placeholder="Question"
                      value={q.question}
                      onChange={(e) => updateQuestion(idx, "question", e.target.value)}
                    />
                    {/* Four options: a, b, c, d */}
                    <div className="grid grid-cols-2 gap-2">
                      {['a', 'b', 'c', 'd'].map((key) => (
                        <Input
                          key={key}
                          placeholder={`Option ${key.toUpperCase()}`}
                          value={optionsObj[key]}
                          onChange={e => {
                            const newOptions = { ...optionsObj, [key]: e.target.value };
                            updateQuestion(idx, 'options', newOptions);
                          }}
                        />
                      ))}
                    </div>
                    {/* Correct answer selection */}
                    <div className="mt-2">
                      <span className="text-sm font-medium">Correct Answer(s):</span>
                      <div className="flex gap-4 mt-1">
                        {q.type === 1 ? (
                          // Single Choice: radio
                          ['a', 'b', 'c', 'd'].map((key) => (
                            <label key={key} className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name={`single-correct-${idx}`}
                                checked={q.correct_answers === key}
                                onChange={() => handleCorrectAnswer(idx, key, true, 1, q.correct_answers)}
                              />
                              <span>{optionsObj[key] || key.toUpperCase()}</span>
                            </label>
                          ))
                        ) : (
                          // Multiple Choice: checkbox
                          ['a', 'b', 'c', 'd'].map((key) => (
                            <label key={key} className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={correctArr.includes(key)}
                                onChange={e => handleCorrectAnswer(idx, key, e.target.checked, 0, q.correct_answers)}
                              />
                              <span>{optionsObj[key] || key.toUpperCase()}</span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Save: ensure options/correct_answers are in correct format
              const questions = localQuiz.questions.map(q => {
                // Ensure options is a JSON string with a,b,c,d
                const optionsObj = parseOptions(q.options);
                const optionsStr = JSON.stringify(optionsObj);
                // correct_answers: single = 'a', multiple = 'a,b,c'
                const correct = q.correct_answers || '';
                return {
                  ...q,
                  options: optionsStr,
                  correct_answers: correct,
                };
              });
              onSave({
                title: localQuiz.title,
                description: localQuiz.description,
                passing_score: localQuiz.passing_score,
                max_attempts: localQuiz.max_attempts,
                questions,
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