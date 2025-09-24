import React from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Fade } from 'react-awesome-reveal';
import './BirthdaySnakeGame.css'; // Reusing some styles

const Wish = () => {
  const { width, height } = useWindowSize();

  return (
    <div className="game-container">
      <Confetti width={width} height={height} />
      <Fade cascade>
        <div className="game-over-screen">
          <h2 className="glitch-text">Yayy 7 Croreeeee</h2>
          <p className="birthday-wish">Happy 18th Birthday, Sayana!</p>
          <p className="text-xl mt-4">Daddy wishes you Happy 18th birthday.</p>
          <p className="text-xl">You are an amazing person Thick ass bangalan.</p>
          <p className="text-xl">and have a great day! Almost forgot about this tho did it last moment me hehe.</p>
        </div>
      </Fade>
    </div>
  );
};

export default Wish;
