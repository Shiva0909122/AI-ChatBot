import { useState, useEffect } from 'react'; // Add useEffect import
import axios from "axios";
import './App.css';

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]); // New state to hold question-answer history

  // Load history from localStorage on initial load
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('history')) || [];
    setHistory(savedHistory);
  }, []);

  // Store history in localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('history', JSON.stringify(history));
    }
  }, [history]);

  // Function to clear history
  function clearHistory() {
    localStorage.removeItem('history');
    setHistory([]);
  }

  async function generateAnswer() {
    setAnswer("loading...");
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCMH_SzGFnhmjh1XrzFl6X53wpBt2AorJM",
        method: "post",
        data: {
          contents: [{
            parts: [{ text: question }]
          }],
        },
      });

      const newAnswer = response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      setAnswer(newAnswer);

      // Add the question and answer to history
      setHistory([...history, { question, answer: newAnswer }]);
      setQuestion(""); // Clear the question input
    } catch (error) {
      setAnswer("Error generating answer.");
    }
  }

  return (
    <>
      <h1 className="chat-header">Shiv Chatbot 🤖</h1>
      <div className="app-container">
        <div className="chat-card">
          <div className="leftbox">
            <textarea
              className="input-textarea"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything..."
            />
            <button className="generate-button" onClick={generateAnswer}>
              Generate Answer
            </button>

            <div className="answer-container">
              <p>{answer}</p>
            </div>
          </div><div className="rightbox">
            <div className="history-container">
              <h2>Previous Questions</h2>
              <ol>
                {history.map((item, index) => (
                  <li key={index}>
                    <strong>Q: </strong>{item.question}<br />
                    <strong>A: </strong>{item.answer}
                  </li>
                ))}
              </ol>
            </div>

            <button onClick={clearHistory}>Clear History</button>

          </div>
        </div>
      </div>
      <footer >
        <p id="foot">INDOLIKE Intern &copy;  ReactJs Development © | All rights reserved by
          <a href="https://www.linkedin.com/in/shivarth-dronachary/" target="_blank">
            Shivarth_217252115❤️
          </a>
        </p>
      </footer>
    </>
  );
}

export default App;

