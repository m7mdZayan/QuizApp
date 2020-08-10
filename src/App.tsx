import React, { useState } from "react";
import { fetchQuizQuestions, Difficulty, QuestionState } from "./api";
import "./app.css";
// componentes
import QuestionCard from "./components/QuestionCard";

const TOTAL_QUESTION = 10;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

function App() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameover, setGameover] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameover(false);
    const newQuesstions = await fetchQuizQuestions(
      TOTAL_QUESTION,
      Difficulty.EASY
    );
    setQuestions(newQuesstions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameover) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) {
        setScore((prev) => prev + 1);
      }
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTION) {
      setGameover(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <div className="App">
      <h1>react quiz</h1>
      {gameover || userAnswers.length === TOTAL_QUESTION ? (
        <button className="start" onClick={startTrivia}>
          start quiz
        </button>
      ) : null}

      {!gameover ? <p className="score">score: {score}</p> : null}

      {loading && <p>loading question ....</p>}
      {!loading && !gameover && (
        <QuestionCard
          questionNum={number + 1}
          totalQuestions={TOTAL_QUESTION}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAnswer}
        />
      )}

      {!loading &&
      !gameover &&
      userAnswers.length === number + 1 &&
      number !== TOTAL_QUESTION - 1 ? (
        <button className="next" onClick={nextQuestion}>
          next question
        </button>
      ) : null}
    </div>
  );
}

export default App;
