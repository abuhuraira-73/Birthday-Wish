import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './BirthdaySnakeGame.css';

const GRID_SIZE = 20;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const SNAKE_SPEED = 100; // in ms
const WINNING_SCORE = 18;

const BirthdaySnakeGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameOver'
  const [score, setScore] = useState(0);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState('right');
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [particles, setParticles] = useState([]);
  const [isStarting, setIsStarting] = useState(false);
  const navigate = useNavigate();

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrameId;

    const drawGrid = () => {
      context.strokeStyle = 'rgba(0, 255, 0, 0.2)';
      for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
        context.moveTo(x, 0);
        context.lineTo(x, CANVAS_HEIGHT);
      }
      for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
        context.moveTo(0, y);
        context.lineTo(CANVAS_WIDTH, y);
      }
      context.stroke();
    };

    const drawSnake = () => {
      const hue = Date.now() / 10 % 360;

      snake.forEach((segment, index) => {
        const segmentHue = (hue + index * 10) % 360; // Subtle color shift along the snake
        const segmentColor = `hsl(${segmentHue}, 100%, 50%)`;

        context.beginPath();
        context.arc(segment.x * GRID_SIZE + GRID_SIZE / 2, segment.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE / 2, 0, 2 * Math.PI);
        context.fillStyle = segmentColor;
        context.shadowColor = segmentColor;
        context.shadowBlur = 10;
        context.fill();

        if (index === 0) {
          // Draw custom head
          context.fillStyle = `hsl(${(hue + 90) % 360}, 100%, 70%)`; // Brighter head color
          context.beginPath();
          context.arc(segment.x * GRID_SIZE + GRID_SIZE / 2, segment.y * GRID_SIZE + GRID_SIZE / 2, GRID_SIZE / 2 * 1.1, 0, 2 * Math.PI); // Slightly larger
          context.fill();

          // Eyes
          context.fillStyle = '#000';
          context.beginPath();
          context.arc(segment.x * GRID_SIZE + GRID_SIZE / 2 - GRID_SIZE / 4, segment.y * GRID_SIZE + GRID_SIZE / 2 - GRID_SIZE / 4, GRID_SIZE / 8, 0, 2 * Math.PI);
          context.arc(segment.x * GRID_SIZE + GRID_SIZE / 2 + GRID_SIZE / 4, segment.y * GRID_SIZE + GRID_SIZE / 2 - GRID_SIZE / 4, GRID_SIZE / 8, 0, 2 * Math.PI);
          context.fill();
        }
      });
    };

    const drawFood = () => {
      context.save();
      const foodX = food.x * GRID_SIZE + GRID_SIZE / 2;
      const foodY = food.y * GRID_SIZE + GRID_SIZE / 2;
      context.font = `${GRID_SIZE * 1.5}px Orbitron`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('🍎', foodX, foodY);
      context.restore();
    };

    const drawParticles = () => {
      particles.forEach((p, index) => {
        context.fillStyle = p.color;
        context.fillRect(p.x, p.y, p.size, p.size);
        p.x += p.vx;
        p.y += p.vy;
        p.size *= 0.95;
        if (p.size < 0.5) {
          particles.splice(index, 1);
        }
      });
    };

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'up': head.y -= 1; break;
        case 'down': head.y += 1; break;
        case 'left': head.x -= 1; break;
        case 'right': head.x += 1; break;
        default: break;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        const newScore = score + 1;
        setScore(newScore);
        createParticles(food.x * GRID_SIZE, food.y * GRID_SIZE);
        if (newScore === WINNING_SCORE) {
          navigate('/game2'); // Navigate to Game 2
        } else {
          generateFood();
        }
      } else {
        newSnake.pop();
      }

      if (head.x < 0 || head.x >= CANVAS_WIDTH / GRID_SIZE || head.y < 0 || head.y >= CANVAS_HEIGHT / GRID_SIZE) {
        setGameState('gameOver');
      }

      for (let i = 1; i < newSnake.length; i++) {
        if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
          setGameState('gameOver');
        }
      }

      setSnake(newSnake);
    };

    const createParticles = (x, y) => {
      for (let i = 0; i < 50; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          size: Math.random() * 5 + 2,
          color: `hsl(${Math.random() * 60 + 330}, 100%, 50%)`,
        });
      }
      setParticles([...particles]);
    };

    const gameInterval = setInterval(moveSnake, SNAKE_SPEED);

    const gameLoop = () => {
      if (gameState !== 'playing') {
        clearInterval(gameInterval);
        cancelAnimationFrame(animationFrameId);
        return;
      }
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      drawGrid();
      drawFood();
      drawSnake();
      drawParticles();
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      clearInterval(gameInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, snake, direction, food, score, particles]);

  const generateFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * (CANVAS_WIDTH / GRID_SIZE)),
        y: Math.floor(Math.random() * (CANVAS_HEIGHT / GRID_SIZE)),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'down') setDirection('up'); break;
        case 'ArrowDown': if (direction !== 'up') setDirection('down'); break;
        case 'ArrowLeft': if (direction !== 'right') setDirection('left'); break;
        case 'ArrowRight': if (direction !== 'left') setDirection('right'); break;
        default: break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const resetGame = () => {
    setScore(0);
    setSnake([{ x: 10, y: 10 }]);
    setDirection('right');
    generateFood();
    setParticles([]);
    setIsStarting(true);
    setTimeout(() => {
      setGameState('playing');
      setIsStarting(false);
    }, 1000);
  };

  return (
    <div className={`game-container`}>
      {gameState === 'start' && (
        <div className="start-screen">
          <h1>Dekh mai kitna accha hu na bbg?</h1>
          <button onClick={resetGame}>Choke me</button>
        </div>
      )}

      {(gameState === 'playing' || isStarting) && (
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className={`game-board ${isStarting ? 'game-board-start' : ''}`}
        />
      )}

      {gameState === 'gameOver' && (
        <div className="game-over-screen">
          <h2 className="glitch-text">Game Over</h2>
          <p>You reached Level {score}! Here's to your next great adventure.</p>
          <button onClick={resetGame}>Play Again</button>
        </div>
      )}

      {/* Removed 'won' state rendering from here */}

      <div className="scoreboard">Score: {score} / {WINNING_SCORE}</div>
    </div>
  );
};

export default BirthdaySnakeGame;
