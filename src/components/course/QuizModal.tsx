import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";

export function QuizModal({ open, onClose, quiz, onSave }) {
  const [localQuiz, setLocalQuiz] = useState(quiz || {
    title: "",
    description: "",
    questions: [],
    passPercentage: 70,
    allowRetakes: true,
  });

  useEffect(() => {
    setLocalQuiz(
      quiz || {
        title: "",
        description: "",
        questions: [],
        passPercentage: 70,
        allowRetakes: true,
      }
    );
  }, [quiz, open]);

  const addQuestion = () => {
    setLocalQuiz((q) => ({
      ...q,
      questions: [
        ...q.questions,
        {
          question: "",
          type: "mcq",
          options: ["", "", "", ""],
          correctAnswer: "",
          points: 1,
          explanation: "",
        },
      ],
    }));
  };

  const updateQuestion = (idx, field, value) => {
    const questions = [...localQuiz.questions];
    questions[idx][field] = value;
    setLocalQuiz((q) => ({ ...q, questions }));
  };

  const updateQuestionOption = (qIdx, optIdx, value) => {
    const questions = [...localQuiz.questions];
    if (!questions[qIdx].options) questions[qIdx].options = ["", "", "", ""];
    questions[qIdx].options[optIdx] = value;
    setLocalQuiz((q) => ({ ...q, questions }));
  };

  const removeQuestion = (idx) => {
    setLocalQuiz((q) => ({
      ...q,
      questions: q.questions.filter((_, i) => i !== idx),
    }));
  };

  const handleTypeChange = (idx, type) => {
    const questions = [...localQuiz.questions];
    if (type === "mcq") {
      questions[idx] = {
        ...questions[idx],
        type,
        options: ["", "", "", ""],
        correctAnswer: "",
      };
    } else if (type === "true-false") {
      questions[idx] = {
        ...questions[idx],
        type,
        options: ["True", "False"],
        correctAnswer: true,
      };
    } else {
      questions[idx] = {
        ...questions[idx],
        type,
        options: undefined,
        correctAnswer: "",
      };
    }
    setLocalQuiz((q) => ({ ...q, questions }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Quiz</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
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
          <div className="flex justify-between items-center">
            <span className="font-medium">Questions</span>
            <Button size="sm" onClick={addQuestion}>
              <Plus className="h-4 w-4 mr-1" /> Add Question
            </Button>
          </div>
          {localQuiz.questions.map((q, idx) => (
            <div key={idx} className="border p-2 rounded mb-2 space-y-2">
              <div className="flex gap-2 items-center">
                <Select
                  value={q.type}
                  onValueChange={(value) => handleTypeChange(idx, value)}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">Multiple Choice</SelectItem>
                    <SelectItem value="true-false">True/False</SelectItem>
                    <SelectItem value="short-answer">Short Answer</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={1}
                  className="w-24"
                  value={q.points}
                  onChange={(e) => updateQuestion(idx, "points", parseInt(e.target.value) || 1)}
                  placeholder="Points"
                />
                <Button size="sm" variant="ghost" onClick={() => removeQuestion(idx)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Input
                placeholder="Question"
                value={q.question}
                onChange={(e) => updateQuestion(idx, "question", e.target.value)}
              />
              {q.type === "mcq" && (
                <div className="space-y-2">
                  {q.options?.map((option, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-2">
                      <RadioGroup
                        value={q.correctAnswer?.toString()}
                        onValueChange={(value) => updateQuestion(idx, "correctAnswer", value)}
                      >
                        <RadioGroupItem value={optIdx.toString()} id={`q${idx}-opt${optIdx}`} />
                      </RadioGroup>
                      <Input
                        value={option}
                        onChange={(e) => updateQuestionOption(idx, optIdx, e.target.value)}
                        placeholder={`Option ${optIdx + 1}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
              )}
              {q.type === "true-false" && (
                <RadioGroup
                  value={q.correctAnswer?.toString()}
                  onValueChange={(value) => updateQuestion(idx, "correctAnswer", value === "true")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id={`q${idx}-true`} />
                    <label htmlFor={`q${idx}-true`}>True</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id={`q${idx}-false`} />
                    <label htmlFor={`q${idx}-false`}>False</label>
                  </div>
                </RadioGroup>
              )}
              {q.type === "short-answer" && (
                <Input
                  value={q.correctAnswer as string}
                  onChange={(e) => updateQuestion(idx, "correctAnswer", e.target.value)}
                  placeholder="Sample correct answer"
                />
              )}
              <Textarea
                value={q.explanation || ""}
                onChange={(e) => updateQuestion(idx, "explanation", e.target.value)}
                placeholder="Explanation (optional)"
                rows={2}
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(localQuiz);
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