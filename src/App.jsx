import React, { useState } from "react";
import "./App.css";

function App() {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    const newQ = {
      id: Date.now(),
      text: newQuestion,
      answer: "",
      isAnswered: false,
      timestamp: new Date().toLocaleString(),
      votes: 0,
      isBookmarked: false,
    };

    setQuestions([newQ, ...questions]);
    setNewQuestion("");
  };

  const handleAnswerChange = (questionId, answer) => {
    setDisabled(false);
    setQuestions(
      questions.map((question) => (question.id === questionId ? { ...question, answer } : question))
    );
  };

  const handleAnswerSubmit = (questionId) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId ? { ...question, isAnswered: true } : question
      )
    );
    setDisabled(true);
  };

  const toggleBookmark = (questionId) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId ? { ...question, isBookmarked: !question.isBookmarked } : question
      )
    );
  };

  const handleVote = (questionId, delta) => {
    setQuestions(
      questions.map((question) =>
        question.id === questionId ? { ...question, votes: question.votes + delta } : question
      )
    );
  };

  const sortedAndFilteredQuestions = questions
    .filter((question) => !showBookmarks || question.isBookmarked)
    .sort((a, b) => {
      if (sortBy === "votes") {
        return b.votes - a.votes;
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });

  return (
    <div className="app">
      <div className="wrapper">
        <p>ASK Questions</p>
        <form onSubmit={handleQuestionSubmit} className="question-form">
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Enter your question"
          />
          <button type="submit">Submit</button>
        </form>
      </div>

      <hr />

      <div className="wrapper">
        <div className="sort-options">
          <p>SORT</p>
          <label>
            <input
              type="radio"
              name="sort"
              value="date"
              checked={sortBy === "date"}
              onChange={() => setSortBy("date")}
            />
            Date
          </label>
          <label>
            <input
              type="radio"
              name="sort"
              value="votes"
              checked={sortBy === "votes"}
              onChange={() => setSortBy("votes")}
            />
            Votes
          </label>
        </div>
        <button
          onClick={() => setShowBookmarks(!showBookmarks)}
          className={`bookmarks-btn ${showBookmarks ? "active" : ""}`}
        >
          {showBookmarks ? "All" : "Bookmarks"}
        </button>
      </div>
      <hr />
      <div className="questions-list wrapper" >
        {sortedAndFilteredQuestions.map((question) => (
          <div key={question.id} className="question-card">
            <div className="question-header">
              <div>
                <p className="votes">{question.votes}</p>
                <button
                  className="btn-transparent"
                  onClick={() => handleVote(question.id, 1)}
                >
                  ⬆️
                </button>
                <button
                  className="btn-transparent"
                  onClick={() => handleVote(question.id, -1)}
                >
                  ⬇️
                </button>
              </div>
              <p className="timestamp">{question.timestamp}</p>

              <button
                onClick={() => toggleBookmark(question.id)}
                className={`bookmark-btn ${
                  question.isBookmarked ? "bookmarked" : ""
                } btn-transparent`}
              >
                {question.isBookmarked ? "🌟" : "⭐"}
              </button>
            </div>
            <h3 className="question-text" onDoubleClick={()=> {setDisabled((prev)=>{
              console.log(disabled);
              return !prev
              } )}}>{question.text}</h3>

            <div className="answer-section" >
              <input
                type="text"
                value={question.answer}
                onChange={(e) =>
                  handleAnswerChange(question.id, e.target.value)
                }
                placeholder="Enter your answer"
                className="answer-input"
                disabled={disabled}
                
              />
              {!disabled? <button
                  onClick={() => handleAnswerSubmit(question.id)}
                  className="submit-answer"
                >
                  Submit
                </button> : ""}
                
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
