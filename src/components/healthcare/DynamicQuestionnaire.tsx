"use client";

import React, { useState } from "react";
import { useSpecialtyStore, type Specialty } from "@/store/specialty-store";
import { type CaseAnswer } from "@/store/case-store";
import { ChevronLeft, ChevronRight, HelpCircle, ThumbsUp, ThumbsDown } from "lucide-react";

interface Props {
  specialty: Specialty;
  onComplete: (answers: CaseAnswer[]) => void;
  onBack: () => void;
}

export default function DynamicQuestionnaire({ specialty, onComplete, onBack }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const activeQuestions = specialty.questions.filter((q) => q.isActive);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentQ < activeQuestions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    const result: CaseAnswer[] = activeQuestions.map((q) => ({
      questionId: q.id,
      question: q.question,
      answer: answers[q.id] || "Not answered",
    }));
    onComplete(result);
  };

  if (activeQuestions.length === 0) {
    return (
      <div className="text-center py-12">
        <HelpCircle size={40} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-400">No questions configured for this specialty.</p>
        <button onClick={() => onComplete([])} className="mt-4 px-5 py-2.5 rounded-xl bg-[#1e3a5f] text-white text-sm font-semibold hover:bg-[#163050]">
          Skip Questionnaire
        </button>
      </div>
    );
  }

  const question = activeQuestions[currentQ];
  const hasAnswered = answers[question.id] !== undefined;
  const progress = ((currentQ + 1) / activeQuestions.length) * 100;

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Question {currentQ + 1} of {activeQuestions.length}</span>
          <span className="font-semibold text-[#1e3a5f]">{specialty.name}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#1e3a5f] rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{specialty.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">{specialty.name} Questionnaire</h3>
            <p className="text-sm text-gray-400">Please answer the following questions</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#1e3a5f] text-white flex items-center justify-center text-sm font-bold shrink-0">
              {currentQ + 1}
            </div>
            <p className="text-base font-semibold text-gray-900 pt-1.5">{question.question}</p>
          </div>

          <div className="flex items-center gap-3 pl-11">
            <button
              onClick={() => handleAnswer(question.id, "Yes")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                answers[question.id] === "Yes"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50/50"
              }`}
            >
              <ThumbsUp size={16} />
              Yes
            </button>
            <button
              onClick={() => handleAnswer(question.id, "No")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                answers[question.id] === "No"
                  ? "border-red-500 bg-red-50 text-red-700"
                  : "border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50/50"
              }`}
            >
              <ThumbsDown size={16} />
              No
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <button
            onClick={currentQ === 0 ? onBack : handlePrev}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
          >
            <ChevronLeft size={16} /> {currentQ === 0 ? "Back to Specialties" : "Previous"}
          </button>

          {currentQ < activeQuestions.length - 1 ? (
            <button
              onClick={handleNext}
              disabled={!hasAnswered}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#1e3a5f] text-white hover:bg-[#163050] disabled:bg-gray-200 disabled:text-gray-400 transition-all"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-green-600 text-white hover:bg-green-700 shadow-md transition-all"
            >
              Complete Questionnaire
            </button>
          )}
        </div>
      </div>

      {/* Summary dots */}
      <div className="flex justify-center gap-1.5">
        {activeQuestions.map((q, i) => (
          <div
            key={q.id}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === currentQ ? "bg-[#1e3a5f] scale-125" : answers[q.id] ? "bg-green-400" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
