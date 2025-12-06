import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";

// Helper for default options
const defaultOptions = { a: '', b: '', c: '', d: '' };

const blockNonNumericKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const controlKeys = [
    "Backspace",
    "Tab",
    "ArrowLeft",
    "ArrowRight",
    "Delete",
    "Home",
    "End",
  ];

  if (controlKeys.includes(e.key)) return;

  // Allow a single decimal point
  if (e.key === ".") {
    const value = (e.currentTarget.value || "");
    if (value.includes(".")) {
      e.preventDefault();
    }
    return;
  }

  // Block anything that is not a digit 0-9
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
};

export function QuizModal({ open, onClose, quiz, onSave }) {
  const [localQuiz, setLocalQuiz] = useState(quiz || {
    title: "",
    description: "",
    // start empty; will be converted to numbers on save
    passing_score: "",
    max_attempts: "",
    questions: [],
  });

  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([]);

  useEffect(() => {
    if (quiz) {
      const questionsWithFlags = (quiz.questions || []).map((q) => ({
        ...q,
        // if MCQ and stored correct_answers has multiple keys (e.g. 'a,b'), enable multi-select mode
        allowMultiple:
          q.type === 0 && typeof q.correct_answers === 'string' && q.correct_answers.includes(',')
            ? true
            : q.allowMultiple || false,
      }));
      setLocalQuiz({
        title: quiz.title || "",
        description: quiz.description || "",
        passing_score: quiz.passing_score ?? "",
        max_attempts: quiz.max_attempts ?? "",
        questions: questionsWithFlags,
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
    if (!optionsStr) {
      return { ...defaultOptions };
    }
    try {
      const parsed = JSON.parse(optionsStr);
      return { ...defaultOptions, ...parsed };
    } catch {
      // Try CSV fallback: "optA,optB,optC,optD"
      const parts = String(optionsStr)
        .split(',')
        .map((s) => s.trim());
      return {
        a: parts[0] || '',
        b: parts[1] || '',
        c: parts[2] || '',
        d: parts[3] || '',
      };
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
          type: 0, // 0 = MCQ, 1 = True/False, 2 = Fill in the Blank
          options: JSON.stringify(defaultOptions),
          correct_answers: "",
          points: 1,
          // local-only flag to control MCQ selection mode; not persisted
          allowMultiple: false,
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
    if (type === 0) {
      // MCQ: honor allowMultiple flag
      const questions = [...localQuiz.questions];
      const isMultiple = questions[idx]?.allowMultiple || false;
      if (isMultiple) {
      let arr = prevCorrect ? prevCorrect.split(',').filter(Boolean) : [];
      if (checked) {
        if (!arr.includes(key)) arr.push(key);
      } else {
        arr = arr.filter((k) => k !== key);
      }
      updateQuestion(idx, 'correct_answers', arr.join(','));
      } else {
        updateQuestion(idx, 'correct_answers', key);
      }
    } else if (type === 1) {
      // True/False
      updateQuestion(idx, 'correct_answers', key);
    } else if (type === 2) {
      // Fill in the Blank handled via input field
      updateQuestion(idx, 'correct_answers', key);
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
              type="number"
              required={true}
              onKeyDown={blockNonNumericKeys}
              value={localQuiz.passing_score ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setLocalQuiz((q) => ({
                  ...q,
                  passing_score: value,
                }));
              }}
              placeholder="Passing Score (%)"
              className="w-40"
            />
            <Input
              type="number"
              required={true}
              onKeyDown={blockNonNumericKeys}
              value={localQuiz.max_attempts ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setLocalQuiz((q) => ({
                  ...q,
                  max_attempts: value,
                }));
              }}
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
                      {q.type === 0 ? "Multiple Choice" : q.type === 1 ? "True/False" : "Fill in the Blank"}
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
                        onValueChange={(value) => {
                          const nextType = parseInt(value);
                          // Reset fields appropriately when changing type
                          if (nextType === 0) {
                            // MCQ
                            updateQuestion(idx, "type", nextType);
                            updateQuestion(idx, "options", { ...defaultOptions });
                            updateQuestion(idx, "correct_answers", "");
                            const qs = [...localQuiz.questions];
                            qs[idx].allowMultiple = qs[idx]?.allowMultiple || false;
                            setLocalQuiz((qq) => ({ ...qq, questions: qs }));
                          } else if (nextType === 1) {
                            // True/False
                            updateQuestion(idx, "type", nextType);
                            updateQuestion(idx, "options", "");
                            updateQuestion(idx, "correct_answers", "");
                            const qs = [...localQuiz.questions];
                            qs[idx].allowMultiple = false;
                            setLocalQuiz((qq) => ({ ...qq, questions: qs }));
                          } else {
                            // Fill in the Blank
                            updateQuestion(idx, "type", nextType);
                            updateQuestion(idx, "options", "");
                            updateQuestion(idx, "correct_answers", "");
                            const qs = [...localQuiz.questions];
                            qs[idx].allowMultiple = false;
                            setLocalQuiz((qq) => ({ ...qq, questions: qs }));
                          }
                        }}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Multiple Choice</SelectItem>
                          <SelectItem value="1">True / False</SelectItem>
                          <SelectItem value="2">Fill in the Blank</SelectItem>
                        </SelectContent>
                      </Select>
                      <label htmlFor="points">Points</label>
                      <Input
                        type="number"
                        className="w-24"
                        onKeyDown={blockNonNumericKeys}
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
                    {/* Options editor based on type */}
                    {q.type === 0 && (
                      <>
                        <div className="flex items-center gap-2">
                          <input
                            id={`allow-multiple-${idx}`}
                            type="checkbox"
                            checked={!!localQuiz.questions[idx]?.allowMultiple}
                            onChange={(e) => {
                              const qs = [...localQuiz.questions];
                              qs[idx].allowMultiple = e.target.checked;
                              // clear current answers if switching mode
                              qs[idx].correct_answers = "";
                              setLocalQuiz((qq) => ({ ...qq, questions: qs }));
                            }}
                          />
                          <label htmlFor={`allow-multiple-${idx}`} className="text-sm">Allow multiple correct answers</label>
                        </div>
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
                      </>
                    )}
                    {q.type === 1 && (
                      <div className="text-sm text-muted-foreground">
                        Select whether the correct answer is True or False.
                      </div>
                    )}
                    {q.type === 2 && (
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">
                          Enter the correct answer text. For multiple acceptable answers, separate with commas.
                        </div>
                        <Input
                          placeholder="Correct answer(s)"
                          value={q.correct_answers || ''}
                          onChange={(e) => updateQuestion(idx, 'correct_answers', e.target.value)}
                        />
                      </div>
                    )}
                    {/* Correct answer selection */}
                    <div className="mt-2">
                      <span className="text-sm font-medium">Correct Answer(s):</span>
                      <div className="flex gap-4 mt-1">
                        {q.type === 0 && (
                          (localQuiz.questions[idx]?.allowMultiple ? (
                            ['a', 'b', 'c', 'd'].map((key) => (
                              <label key={key} className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={correctArr.includes(key)}
                                  onChange={(e) => handleCorrectAnswer(idx, key, e.target.checked, 0, q.correct_answers)}
                                />
                                <span>{optionsObj[key] || key.toUpperCase()}</span>
                              </label>
                            ))
                          ) : (
                          ['a', 'b', 'c', 'd'].map((key) => (
                            <label key={key} className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name={`single-correct-${idx}`}
                                checked={q.correct_answers === key}
                                  onChange={() => handleCorrectAnswer(idx, key, true, 0, q.correct_answers)}
                              />
                              <span>{optionsObj[key] || key.toUpperCase()}</span>
                            </label>
                          ))
                          ))
                        )}
                        {q.type === 1 && (
                          [
                            { key: 'true', label: 'True' },
                            { key: 'false', label: 'False' },
                          ].map(({ key, label }) => (
                            <label key={key} className="flex items-center gap-1 cursor-pointer">
                              <input
                                type="radio"
                                name={`tf-correct-${idx}`}
                                checked={q.correct_answers === key}
                                onChange={() => handleCorrectAnswer(idx, key, true, 1, q.correct_answers)}
                              />
                              <span>{label}</span>
                            </label>
                          ))
                        )}
                        {q.type === 2 && (
                          <span className="text-xs text-muted-foreground">Set above in the answer field</span>
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
                const base: any = {
                  question: q.question,
                  type: q.type,
                  points: q.points,
                };
                if (q.type === 0) {
                const optionsObj = parseOptions(q.options);
                  base.options = ['a','b','c','d'].map((k) => optionsObj[k] || '').join(',');
                  base.correct_answers = q.correct_answers || '';
                } else if (q.type === 1) {
                  base.options = '';
                  base.correct_answers = q.correct_answers === 'true' ? 'true' : q.correct_answers === 'false' ? 'false' : '';
                } else if (q.type === 2) {
                  base.options = '';
                  base.correct_answers = q.correct_answers || '';
                }
                return base;
              });
              onSave({
                title: localQuiz.title,
                description: localQuiz.description,
                // coerce to numbers for ModalQuizDto / API
                passing_score: Number(localQuiz.passing_score) || 0,
                max_attempts: Number(localQuiz.max_attempts) || 1,
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