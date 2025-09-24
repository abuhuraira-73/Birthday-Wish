import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fade } from 'react-awesome-reveal';
import './BirthdaySnakeGame.css'; // Reusing some styles

const Game2 = () => {
  const [answer, setAnswer] = useState('');
  const navigate = useNavigate();

  const correctAnswers = ['sam', 'sameer', 'abu'];

  const handleSubmit = () => {
    if (correctAnswers.includes(answer.toLowerCase())) {
      navigate('/wish');
    } else {
      alert('Incorrect answer! Try again.');
    }
  };

  return (
    <div className="game-container">
      <Fade cascade>
        <div className="start-screen">
          <h2>Game 2: The Ultimate Question</h2>
          <h1><p className="text-2xl mb-8">Who is your Daddy Sayana? 🌝</p></h1>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="cyber-input"
            placeholder="Bata bata you know it...."
          />
          <button onClick={handleSubmit}>Choke me</button>
        </div>
      </Fade>
    </div>
  );
};

export default Game2;
