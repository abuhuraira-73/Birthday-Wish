import { Routes, Route } from 'react-router-dom';
import BirthdaySnakeGame from './BirthdaySnakeGame';
import Game2 from './Game2';
import Wish from './Wish';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BirthdaySnakeGame />} />
      <Route path="/game2" element={<Game2 />} />
      <Route path="/wish" element={<Wish />} />
    </Routes>
  );
}

export default App;
