"use client";

import { useState } from "react";
import { quizzes } from "@/data/quizzes";
import { motion } from "framer-motion";

type Question = {
  question: string;
  options: string[];
  answer: number;
};

type Quiz = {
  id: number;
  title: string;
  questions: Question[];
};

function getRandomQuestions(questions: Question[], count: number): Question[]  {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default function QuizPage() {

const [quizIndex, setQuizIndex] = useState<number | null>(null);
const [questionIndex, setQuestionIndex] = useState(0);
const [score, setScore] = useState(0);
const [finished, setFinished] = useState(false);
const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);

if (quizIndex === null) {
return (
<div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center px-4 pt-28">

<h1 className="text-4xl font-bold text-green-400 mb-8">
Cyber Awareness Quiz
</h1>

<div className="w-full max-w-6xl">

  {/* First 9 quizzes in 3x3 grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

    {quizzes.slice(0, 9).map((quiz, index) => (

      <motion.div
        key={index}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
        setQuizIndex(index);
        setSelectedQuestions(getRandomQuestions(quizzes[index].questions, 10));
        }}
        className="
          bg-[#020617]/60
          border border-green-400/30
          p-8
          rounded-2xl
          cursor-pointer
          backdrop-blur-lg
          hover:border-green-400
          hover:bg-green-400/10
          hover:shadow-green-400/40
          hover:shadow-xl
          transition
          text-center
        "
      >

        <h2 className="text-xl font-semibold text-green-300">
          {quiz.title}
        </h2>

        <p className="text-gray-400 mt-3 text-sm">
          10 Questions • Awareness Test
        </p>

      </motion.div>

    ))}

  </div>

  {/* 10th quiz centered below */}
  <div className="flex justify-center mt-10">

    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => {
      setQuizIndex(9);
      setSelectedQuestions(getRandomQuestions(quizzes[9].questions, 10));
      }}
      className="
        bg-[#020617]/60
        border border-green-400/30
        p-8
        rounded-2xl
        cursor-pointer
        backdrop-blur-lg
        hover:border-green-400
        hover:bg-green-400/10
        hover:shadow-green-400/40
        hover:shadow-xl
        transition
        text-center
        max-w-md
        w-full
      "
    >

      <h2 className="text-xl font-semibold text-green-300">
        {quizzes[9].title}
      </h2>

      <p className="text-gray-400 mt-3 text-sm">
        Advanced Level • 10 Questions
      </p>

    </motion.div>

  </div>

</div>

</div>
);
}

const quiz = quizzes[quizIndex];
const question = selectedQuestions[questionIndex];

function handleAnswer(index: number) {

if (index === question.answer) {
setScore(score + 1);
}

if (questionIndex + 1 < selectedQuestions.length) {
setQuestionIndex(questionIndex + 1);
}
else {
setFinished(true);
}

}

if (finished) {

return (

<div className="min-h-screen bg-[#020617] flex items-center justify-center">

<div className="bg-[#020617]/60 border border-green-400/30 p-10 rounded-xl text-center">

<h1 className="text-3xl text-green-400 font-bold">
Quiz Completed
</h1>

<p className="text-xl mt-4">
Score: {score}/10
</p>

<button
className="mt-6 px-6 py-3 border border-green-400 rounded-lg hover:bg-green-400/10"
onClick={() => {
setQuizIndex(null);
setQuestionIndex(0);
setScore(0);
setFinished(false);
}}
>
Back to quizzes
</button>

</div>

</div>

);

}

return (

<div className="min-h-screen bg-[#020617] flex items-center justify-center px-4">

<div className="bg-[#020617]/60 border border-green-400/30 p-8 rounded-xl max-w-xl w-full">

<div className="flex justify-between mb-4 text-green-400">
<span>Question {questionIndex + 1}/10</span>
<span>Score: {score}</span>
</div>

<div className="w-full bg-gray-800 h-2 rounded mb-6">

<div
className="bg-green-400 h-2 rounded"
style={{
width: `${((questionIndex + 1) / selectedQuestions.length) * 100}%`
}}
/>

</div>

<h2 className="text-xl mb-6">
{question.question}
</h2>

<div className="space-y-4">

{question.options.map((option: string, index: number) => (

<button
key={index}
onClick={() => handleAnswer(index)}
className="w-full p-3 border border-green-400/30 rounded-lg hover:bg-green-400/10 text-left"
>

{option}

</button>

))}

</div>

</div>

</div>

);

}