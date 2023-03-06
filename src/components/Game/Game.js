import React from 'react';

import { range, sample } from '../../utils';
import { WORDS } from '../../data';
import { checkGuess } from '../../game-helpers';
import { GUESS_LENGTH, NUM_OF_GUESSES_ALLOWED } from '../../constants';

const answer = sample(WORDS);
console.info({ answer });

const emptySlot = range(GUESS_LENGTH).map((i) => ({ letter: '' }));

function Game() {
  const [gameOver, setGameOver] = React.useState(''); // 'won' or 'lost'
  const [guesses, setGuesses] = React.useState([]);
  const [guessInput, setGuessInput] = React.useState('');

  function handleSubmit(evt) {
    evt.preventDefault();

    if (guessInput.length < GUESS_LENGTH) return;

    const guess = checkGuess(guessInput, answer);

    if (guessInput === answer) {
      setGameOver('won');
    } else if (guesses.length === NUM_OF_GUESSES_ALLOWED - 1) {
      setGameOver('lost');
    }

    setGuesses([...guesses, guess]);
    setGuessInput('');
  }

  return (
    <>
      <div className="guess-results">
        {range(NUM_OF_GUESSES_ALLOWED).map((slot) => (
          <Guess key={crypto.randomUUID()} slot={guesses[slot] || emptySlot} />
        ))}
      </div>

      {gameOver === 'won' && <BannerHappy guesses={guesses.length} />}
      {gameOver === 'lost' && <BannerSad />}

      <form className="guess-input-wrapper" onSubmit={handleSubmit}>
        <label htmlFor="guess-input">Enter guess:</label>
        <input
          required
          disabled={gameOver}
          id="guess-input"
          type="text"
          minLength={GUESS_LENGTH}
          maxLength={GUESS_LENGTH}
          value={guessInput}
          onChange={(evt) => setGuessInput(evt.target.value.toUpperCase())}
        />
      </form>
    </>
  );
}

export default Game;

function Guess({ slot }) {
  return (
    <p className="guess">
      {slot.map((cell) => {
        return (
          <span
            key={crypto.randomUUID()}
            className={['cell', cell.status].filter(Boolean).join(' ')}
          >
            {cell.letter}
          </span>
        );
      })}
    </p>
  );
}

function BannerHappy({ guesses }) {
  return (
    <div className="happy banner">
      <p>
        <strong>Congratulations!</strong> Got it in{' '}
        <strong>{guesses} guesses</strong>.
      </p>
    </div>
  );
}

function BannerSad() {
  return (
    <div className="sad banner">
      <p>
        Sorry, the correct answer is <strong>{answer}</strong>.
      </p>
    </div>
  );
}
