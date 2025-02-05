import React, { useState, useRef, useEffect } from "react";
import "./Quiz.css";
import { data } from "../assets/data.js";

function Quiz() {
  const [index, setIndex] = useState(0);
  const [question, setQuestion] = useState(data[0]);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [lastScore, setLastScore] = useState(null);
  const [timer, setTimer] = useState(30); // Added timer state

  const option1 = useRef(null);
  const option2 = useRef(null);
  const option3 = useRef(null);
  const option4 = useRef(null);

  const option_array = [option1, option2, option3, option4];

  useEffect(() => {
    setQuestion(data[index]);
    setLock(false);
    setTimer(30); // Reset timer for each question
    option_array.forEach((option) => {
      option.current.classList.remove("correct", "incorrect");
    });
  }, [index]);

  useEffect(() => {
    if (timer > 0 && !lock) {
      const timerId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timer === 0) {
      // Handle timeout scenario
      option_array[question.ans - 1].current.classList.add("correct");
      setLock(true);
    }
  }, [timer, lock]);

  const checkAns = (e, ans) => {
    if (!lock) {
      if (question.ans === ans) {
        e.target.classList.add("correct");
        setScore(score + 1);
      } else {
        e.target.classList.add("incorrect");
        option_array[question.ans - 1].current.classList.add("correct");
      }
      setLock(true);
    }
  };

  const handleNextQuestion = () => {
    if (index < data.length - 1) {
      setIndex(index + 1);
    }
  };

  const handleRestart = () => {
    setLastScore(score); // Store last score before restarting
    setIndex(0);
    setScore(0);
  };

  const { question: quesText, option1: opt1, option2: opt2, option3: opt3, option4: opt4 } = question;

  return (
    <div className="quiz-container">
      <h1 className="title">Quiz App</h1>
      <div className="quiz-box">
        {index < data.length ? (
          <>
            <h2 className="question">{index + 1}. {quesText}</h2>
            <div className="timer">Time Left: {timer} seconds</div> {/* Timer display */}
            <ul className="options">
              <li ref={option1} onClick={(e) => checkAns(e, 1)}>{opt1}</li>
              <li ref={option2} onClick={(e) => checkAns(e, 2)}>{opt2}</li>
              <li ref={option3} onClick={(e) => checkAns(e, 3)}>{opt3}</li>
              <li ref={option4} onClick={(e) => checkAns(e, 4)}>{opt4}</li>
            </ul>

            <button onClick={handleNextQuestion} disabled={!lock} className={`next-btn ${lock ? "active" : "disabled"}`}>
              Next
            </button>

            <div className="progress">
              Question {index + 1} of {data.length}
            </div>

            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${((index + 1) / data.length) * 100}%` }}></div>
            </div>
          </>
        ) : (
          <div className="result">
            <h2>Your Final Score: {score} out of {data.length}</h2>
            {lastScore !== null && (
              <p className="last-score">Last Score: {lastScore} / {data.length}</p>
            )}
            <button onClick={handleRestart} className="restart-btn">Restart Quiz</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
